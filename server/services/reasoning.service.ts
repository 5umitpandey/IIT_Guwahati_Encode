import { explainWithAI } from "./llm.service.js"

type Input = {
  ingredients: string
  intent?: "mainConcern" | "dailyUse" | "watchOut"
  question?: string
}

function extractIngredientText(raw: string) {
  const lower = raw.toLowerCase()
  const idx = lower.indexOf("ingredients")
  if (idx !== -1) {
    return raw.slice(idx + 11).split("\n").slice(0, 6).join(" ").trim()
  }
  return raw.trim()
}

function emphasizeKeywords(text: string, ingredients: string[]) {
  let clean = text.replace(/[*_`]/g, "")

  ingredients.forEach(word => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(`\\b(${escaped})\\b`, "gi")
    clean = clean.replace(regex, "<strong>$1</strong>")


  })

  return clean
}



export async function runReasoning({
  ingredients,
  intent,
  question
}: Input) {
  const cleaned = extractIngredientText(ingredients)

    const ingredientKeywords = cleaned
    .split(/,|\(|\)|\./)
    .map(s => s.trim())
    .filter(s => s.length > 3)
    .slice(0, 6)


  if (cleaned.length < 10) {
    return {
      decision_summary: "Not enough information to analyze this input.",
      key_insights: [],
      uncertainty_note:
        "Try providing a clearer ingredient list from a food label.",
      confidence_level: "Low"
    }
  } 

  let objective = "Give an overall consumer understanding of this product."

  if (intent === "mainConcern") {
    objective =
      "Identify the single most important concern a consumer should know."
  }

  if (intent === "dailyUse") {
    objective =
      "Explain what happens if this product is consumed frequently over time."
  }

  if (intent === "watchOut") {
    objective =
      "Highlight sensitivities, edge cases, or situations requiring caution."
  }

  if (question) {
    objective = question
  }

  const prompt = `
You are an AI food-label copilot.

Objective:
${objective}

STRICT RULES:
- Output EXACTLY 3 insights
- Each insight must be ONE short sentence (max 20 words)
- Bold ONLY important keywords using **bold**
- No paragraphs
- No uncertainty explanations
- No medical advice
- Be specific to the ingredients
- Bold 2-3 key ingredient or health-relevant terms in EACH insight


Format exactly like this:

SUMMARY:
<one clear consumer verdict>

INSIGHTS:
- <main concern>
- <worth knowing>
- <positive note>

INGREDIENTS:
${cleaned}
`


  const output = await explainWithAI(prompt)

  const summaryMatch = output.match(/SUMMARY:\s*(.*)/)
const insightsMatch = output.match(/INSIGHTS:\s*([\s\S]*)/)

const summary =
  summaryMatch?.[1]?.trim() ??
  "This product has both positives and trade-offs."

const rawInsights =
  insightsMatch?.[1]
    ?.split("\n")
    .map(s =>
  s
    .replace(/^-/, "")
    .replace(/\*\*(.*?)\*\*/g, "**$1**")
    .trim()
)

    .filter(s => s.length > 20)
    .slice(0, 3) ?? []

    const insights = rawInsights.map((text, i) => ({
  label:
    i === 0
      ? "main-concern"
      : i === 2
      ? "positive-note"
      : "worth-knowing",
  text: emphasizeKeywords(text, ingredientKeywords)
}))


const labeledInsights = []

if (rawInsights[0]) {
  labeledInsights.push({
    label: "main-concern",
    text: rawInsights[0]
  })
}

if (rawInsights[1]) {
  labeledInsights.push({
    label: "worth-knowing",
    text: rawInsights[1]
  })
}

if (rawInsights[2]) {
  labeledInsights.push({
    label: "positive-note",
    text: rawInsights[2]
  })
}

  return {
  decision_summary: summary,
  key_insights: insights,
  uncertainty_note:
    "This explanation is based on typical ingredient behavior and available guidance. Individual responses can vary.",
  confidence_level: insights.length === 3 ? "High" : "Moderate"
}


}
