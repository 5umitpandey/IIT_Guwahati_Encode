import fetch from "node-fetch"

const GROQ_API_KEY = process.env.GROQ_API_KEY
const MODEL = "llama-3.1-8b-instant"


console.log("Groq key prefix:", GROQ_API_KEY?.slice(0, 4))

export async function explainWithAI(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not loaded")
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an AI food-label copilot that explains ingredient trade-offs clearly and honestly."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      })
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text)
  }

  const data = await response.json()
  return data.choices[0].message.content
}
