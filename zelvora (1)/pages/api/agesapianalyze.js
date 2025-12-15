export default async function handler(req, res) {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 15000); // 15 sec timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Analyze resume briefly" }] }]
        }),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Gemini failed" });
    }

    const data = await response.json();

    return res.status(200).json({
      status: "done",
      result: data
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Resume analysis failed or timed out"
    });
  }
}