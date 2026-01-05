export async function analyzeIngredients(ingredients: string) {
  const res = await fetch("http://localhost:5000/analyze", {
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
  const res = await fetch("http://localhost:5000/analyze", {
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
  const res = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, question })
  })

  return res.json()
}
