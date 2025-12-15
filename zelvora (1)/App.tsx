import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Comparison } from './components/Comparison';
import { Experience } from './components/Experience';
import { Demo } from './components/Demo';
import { Why } from './components/Why';
import { Pricing } from './components/Pricing';
import { Founder } from './components/Founder';
import { Footer } from './components/Footer';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { PreInterviewSetup, InterviewContextData } from './components/PreInterviewSetup';
import { SystemCheck } from './components/SystemCheck';
import { InterviewRoom } from './components/InterviewRoom';
import { FriendInterviewRoom } from './components/FriendInterviewRoom';
import { InterviewReport } from './components/InterviewReport';
import { Subscription } from './components/Subscription';
import { Onboarding } from './components/Onboarding';
import { AdminDashboard } from './components/AdminDashboard';
import { Checkout } from './components/Checkout';
import { PaymentSuccess } from './components/PaymentSuccess';
import { RefundPolicy } from './components/RefundPolicy';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { UserRole, UserPlan, InterviewReportData } from './types';

// Access Control Logic - Permissions Definition
const getPermissions = (role: UserRole, plan: UserPlan) => {
  if (role === 'FOUNDER_ADMIN' || role === 'POWER_CANDIDATE') {
      return { canViewDetailedReport: true, canSkipCooldown: true };
  }
  // Normal User
  return {
      canViewDetailedReport: plan !== 'Free',
      canSkipCooldown: plan === 'Placement Prep'
  };
};

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard' | 'onboarding' | 'setup' | 'system-check' | 'interview' | 'report' | 'subscription' | 'admin' | 'friend-join' | 'external-checkout' | 'payment-success' | 'refund-policy' | 'privacy-policy'>('landing');
  const [interviewData, setInterviewData] = useState<InterviewContextData | null>(null);
  const [reportData, setReportData] = useState<InterviewReportData | null>(null);
  const [joinToken, setJoinToken] = useState<string | undefined>(undefined);
  
  // Checkout State
  const [pendingPlan, setPendingPlan] = useState<UserPlan>('Free');
  const [pendingAmount, setPendingAmount] = useState<number>(0);
  
  // Persistent Role State
  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
       return (localStorage.getItem('zelvora_user_role') as UserRole) || 'NORMAL_USER';
    }
    return 'NORMAL_USER';
  });

  // Persistent Plan State
  const [userPlan, setUserPlan] = useState<UserPlan>(() => {
    if (typeof window !== 'undefined') {
       return (localStorage.getItem('zelvora_user_plan') as UserPlan) || 'Free';
    }
    return 'Free';
  });

  // Persistent Interview Timer for Gap Enforcement
  const [lastInterviewTime, setLastInterviewTime] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('zelvora_last_interview_time');
        return stored ? parseInt(stored, 10) : null;
    }
    return null;
  });

  // URL Routing for Join Links
  useEffect(() => {
      const path = window.location.pathname;
      // Match /join/{TOKEN} or /join
      const tokenMatch = path.match(/^\/join\/([a-zA-Z0-9]+)$/);
      
      if (tokenMatch) {
          setJoinToken(tokenMatch[1]);
          setCurrentView('friend-join');
      } else if (path === '/join') {
          setCurrentView('friend-join');
      } else if (path === '/privacy-policy') {
          setCurrentView('privacy-policy');
      }
  }, []);

  // Access Control Logging & Persistence
  useEffect(() => {
    localStorage.setItem('zelvora_user_role', userRole);
    localStorage.setItem('zelvora_user_plan', userPlan);
    
    // Security Audit Log (Internal)
    console.group(`[ZELVORA ACCESS SYSTEM] Context Update`);
    console.log("Role:", userRole);
    console.log("Plan:", userPlan);
    console.groupEnd();
  }, [userRole, userPlan]);

  useEffect(() => {
    if (lastInterviewTime) {
        localStorage.setItem('zelvora_last_interview_time', lastInterviewTime.toString());
    }
  }, [lastInterviewTime]);

  const navigateToAuth = () => setCurrentView('auth');
  const navigateToLanding = () => setCurrentView('landing');
  const navigateToDashboard = () => setCurrentView('dashboard');
  const navigateToOnboarding = () => setCurrentView('onboarding');
  const navigateToSetup = () => setCurrentView('setup');
  const navigateToSubscription = () => setCurrentView('subscription');
  
  const handleInterviewStart = (data: InterviewContextData) => {
    setInterviewData(data);
    setCurrentView('system-check');
  };
  
  const handleInterviewFinish = (data?: InterviewReportData) => {
    setLastInterviewTime(Date.now());
    if (data) {
      setReportData(data);
    }
    setCurrentView('report');
  };
  
  const navigateToInterview = () => setCurrentView('interview');
  const navigateToReport = () => setCurrentView('report');

  const handleAdminAccess = () => {
      const key = prompt("ENTER ADMIN ACCESS KEY:");
      if (!key) return;

      if (key === 'PRIYA') {
          setUserRole('FOUNDER_ADMIN');
          setCurrentView('admin');
      } else if (key === 'TANU') {
          setUserRole('INTERNAL_ADMIN');
          setCurrentView('admin');
      } else {
          alert("ACCESS DENIED: Invalid Key.");
      }
  };

  const handleCheckoutStart = (plan: UserPlan, amount: number) => {
      setPendingPlan(plan);
      setPendingAmount(amount);
      setCurrentView('external-checkout'); // Simulates redirect to pay.zelvora.com
  };

  const handlePaymentSuccess = () => {
      // Securely upgrade plan after successful callback
      setUserPlan(pendingPlan);
      if (pendingPlan === 'Placement Prep') {
          setUserRole('POWER_CANDIDATE');
      }
      setCurrentView('payment-success');
  };

  // VIEW ROUTING LOGIC

  if (currentView === 'privacy-policy') {
      return <PrivacyPolicy onBack={() => {
        // If they came from a direct link, go landing. Otherwise try to go back to previous logical step or dashboard
        if (userRole !== 'NORMAL_USER' || userPlan !== 'Free') {
           setCurrentView('dashboard');
        } else {
           setCurrentView('landing');
        }
      }} />;
  }

  if (currentView === 'refund-policy') {
      return <RefundPolicy onBack={navigateToLanding} />;
  }

  if (currentView === 'admin') {
      return (
          <AdminDashboard 
            userRole={userRole} 
            onLogout={() => {
                setUserRole('NORMAL_USER');
                setCurrentView('landing');
            }} 
          />
      );
  }

  if (currentView === 'friend-join') {
      return (
          <FriendInterviewRoom 
            onLeave={() => {
                window.location.href = '/'; // Reset URL on leave
            }}
            onFinish={() => {
                // Friend finished logic
            }}
            initialToken={joinToken}
            isJoinFlow={true}
          />
      );
  }

  // SIMULATED EXTERNAL PAYMENT SITE
  if (currentView === 'external-checkout') {
      return (
          <Checkout 
             plan={pendingPlan}
             amount={pendingAmount}
             onSuccess={handlePaymentSuccess}
             onCancel={() => setCurrentView('subscription')}
          />
      );
  }

  if (currentView === 'payment-success') {
      return <PaymentSuccess onReturnHome={navigateToDashboard} />;
  }

  if (currentView === 'auth') {
    return <Auth onBack={navigateToLanding} onLoginSuccess={navigateToDashboard} />;
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard 
        onStartInterview={navigateToOnboarding}
        onViewReport={navigateToReport}
        onManageSubscription={navigateToSubscription}
        onLogout={navigateToLanding}
        userRole={userRole}
        userPlan={userPlan}
        lastInterviewTime={lastInterviewTime}
      />
    );
  }

  if (currentView === 'onboarding') {
    return (
      <Onboarding 
        onProceed={navigateToSetup}
        onBack={navigateToDashboard}
      />
    );
  }

  if (currentView === 'subscription') {
    return (
      <Subscription 
        onBack={navigateToDashboard}
        onUpgrade={(plan) => {
            setUserPlan(plan as UserPlan);
            alert(`Plan updated to ${plan} successfully.`);
            navigateToDashboard();
        }}
        onRoleUpdate={(role) => setUserRole(role)}
        onNavigateToCheckout={handleCheckoutStart}
      />
    );
  }

  if (currentView === 'setup') {
    return (
      <PreInterviewSetup 
        onBack={navigateToDashboard} 
        onStart={handleInterviewStart}
        userRole={userRole}
      />
    );
  }

  if (currentView === 'system-check') {
    return (
      <SystemCheck 
        onBack={navigateToSetup} 
        onStart={navigateToInterview} 
      />
    );
  }

  if (currentView === 'interview') {
    if (interviewData?.mode === 'peer') {
      return (
        <FriendInterviewRoom 
          onLeave={navigateToDashboard} 
          onFinish={() => handleInterviewFinish()}
          interviewContext={interviewData}
        />
      );
    }
    return (
      <InterviewRoom 
        onLeave={navigateToDashboard} 
        onFinish={handleInterviewFinish}
        interviewContext={interviewData}
      />
    );
  }

  if (currentView === 'report') {
    return <InterviewReport onBack={navigateToDashboard} userRole={userRole} userPlan={userPlan} data={reportData} />;
  }

  // DEFAULT LANDING PAGE
  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={navigateToAuth} />
      <main>
        {/* Section 1: Hero */}
        <Hero onStartClick={navigateToAuth} />
        
        {/* Section 2: Comparison */}
        <Comparison />
        
        {/* Section 3: Modes */}
        <Experience />
        
        {/* Section 4: Demo */}
        <Demo />
        
        {/* Section 5 & 6: Why & Who */}
        <Why />
        
        {/* Section 7: Founder */}
        <Founder />

        {/* Section 8: Pricing */}
        <Pricing />
      </main>
      <Footer 
         onStartClick={navigateToAuth} 
         onLoginClick={navigateToAuth} 
         onAdminClick={handleAdminAccess}
         onPolicyClick={() => setCurrentView('refund-policy')} 
         onPrivacyClick={() => setCurrentView('privacy-policy')}
      />
    </div>
  );
}

export default App;