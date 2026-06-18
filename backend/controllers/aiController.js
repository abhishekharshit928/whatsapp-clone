import axios from "axios";

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      }
    );

    const reply =
      response.data.candidates[0].content.parts[0].text;

    res.json({ reply });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: "AI error" });
  }
};