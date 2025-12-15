export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    // ⏱️ Timeout lagaya (15 sec)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Analyze resume strictly" }] }]
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(500).json({ status: "error", message: "Gemini failed" });
    }

    const data = await response.json();

    return res.status(200).json({
      status: "done",
      result: data
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Resume verification failed"
    });
  }
}
