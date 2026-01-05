export async function analyzeIngredients(ingredients: string) {
  const res = await fetch("https://food-copilot.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients })
  })

  return res.json()
}

export async function getFollowUpAnalysis(
  intent: string,
  ingredients: string
) {
  const res = await fetch("https://food-copilot.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, intent })
  })

  return res.json()
}

export async function askCustomQuestion(
  question: string,
  ingredients: string
) {
  const res = await fetch("https://food-copilot.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, question })
  })

  return res.json()
}
