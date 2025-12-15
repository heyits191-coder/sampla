export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { resume, answers, presence } = req.body;

    const prompt = `
You are a strict AI HR interviewer.

Resume:
${resume}

Answers:
${JSON.stringify(answers)}

Presence:
${JSON.stringify(presence)}

Give final interview report in JSON.
Be strict.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: "AI failed" });
  }
}
