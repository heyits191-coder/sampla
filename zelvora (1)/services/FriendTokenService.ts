import { FriendToken, TokenStatus } from '../types';

/**
 * ZELVORA BACKEND SERVICE - FRIEND TOKEN MODULE
 * 
 * This service simulates a secure backend for managing access tokens.
 * In a real production environment, this would run on a Node.js/Go server 
 * with a Redis or SQL database.
 */

const TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 Minutes
const STORAGE_KEY = 'zelvora_friend_tokens_db';

class FriendTokenService {
  
  // --------------------------------------------------
  // DATABASE SIMULATION
  // --------------------------------------------------
  private getDB(): Record<string, FriendToken> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  private saveToken(tokenData: FriendToken) {
    const db = this.getDB();
    db[tokenData.token] = tokenData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  private updateStatus(token: string, status: TokenStatus) {
    const db = this.getDB();
    if (db[token]) {
      db[token].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
  }

  // --------------------------------------------------
  // CORE LOGIC: GENERATE TOKEN
  // --------------------------------------------------
  public generateToken(creatorId: string, interviewId: string): string {
    // 1. Generate unique 6-char alphanumeric string
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, 1, O, 0 to avoid confusion
    let token = '';
    const db = this.getDB();
    
    // Collision check loop (simple)
    do {
      token = '';
      for (let i = 0; i < 6; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (db[token]);

    // 2. Create Token Record
    const newToken: FriendToken = {
      token,
      creatorId,
      interviewId,
      createdAt: Date.now(),
      expiresAt: Date.now() + TOKEN_EXPIRY_MS,
      status: 'UNUSED'
    };

    // 3. Save to DB
    this.saveToken(newToken);
    
    console.log(`[BACKEND] Generated secure token: ${token} for Interview: ${interviewId}`);
    return token;
  }

  // --------------------------------------------------
  // CORE LOGIC: VALIDATE TOKEN
  // --------------------------------------------------
  public validateToken(token: string): { valid: boolean; reason?: string; errorCode?: 'INVALID' | 'EXPIRED' | 'USED'; context?: any } {
    const db = this.getDB();
    const record = db[token];

    // 1. Check Existence
    if (!record) {
      return { valid: false, reason: "The link you opened doesn’t match any active interview.", errorCode: 'INVALID' };
    }

    // 2. Check Expiry
    if (Date.now() > record.expiresAt) {
      this.updateStatus(token, 'EXPIRED');
      return { valid: false, reason: "Interview links expire after a short time for security reasons.", errorCode: 'EXPIRED' };
    }

    // 3. Check Status
    if (record.status === 'EXPIRED') {
        return { valid: false, reason: "Interview links expire after a short time for security reasons.", errorCode: 'EXPIRED' };
    }
    
    if (record.status === 'USED') {
         // Security: Prevent reuse if the session formally ended
         return { valid: false, reason: "This link has already been used to join the interview.", errorCode: 'USED' };
    }

    // 4. Success Case
    return { 
        valid: true, 
        context: { 
            interviewId: record.interviewId,
            creatorId: record.creatorId 
        } 
    };
  }

  // --------------------------------------------------
  // CORE LOGIC: CONSUME / JOIN SESSION
  // --------------------------------------------------
  public joinSession(token: string): boolean {
    const validation = this.validateToken(token);
    if (!validation.valid) return false;

    // Transition from UNUSED -> ACTIVE
    // We do not mark as 'USED' immediately to allow re-joins if connection drops during the 30m window
    // 'USED' is for when the interview is explicitly finished.
    this.updateStatus(token, 'ACTIVE');
    console.log(`[BACKEND] Token ${token} activated. Friend joined.`);
    return true;
  }

  // --------------------------------------------------
  // CORE LOGIC: END SESSION
  // --------------------------------------------------
  public endSession(token: string) {
    this.updateStatus(token, 'USED'); // Invalidate for future
    console.log(`[BACKEND] Token ${token} marked as USED.`);
  }
}

export const friendTokenService = new FriendTokenService();