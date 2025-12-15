import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: Request) {
  try {
    const { role, experience, resumeBase64 } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const systemInstruction = `
You are ZELVORA Resume Validation Engine.
You behave like a strict ATS + Senior HR.
Return ONLY JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: `Selected Role: ${role}\nExperience Level: ${experience}` },
            { inlineData: { mimeType: "application/pdf", data: resumeBase64 } }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            validation_status: {
              type: Type.STRING,
              enum: ["ACCEPT", "WARNING", "REJECT"]
            },
            message: { type: Type.STRING },
            internal_flags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            resume_summary: { type: Type.STRING }
          },
          required: [
            "validation_status",
            "message",
            "internal_flags",
            "resume_summary"
          ]
        }
      }
    });

    return Response.json({
      status: "done",
      result: JSON.parse(response.text)
    });

  } catch (err) {
    return Response.json(
      { status: "error", message: "Resume validation failed" },
      { status: 500 }
    );
  }
}
