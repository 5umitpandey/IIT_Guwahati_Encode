import { Router } from "express"
import { runReasoning } from "../services/reasoning.service.js"

const router = Router()

router.post("/", async (req, res) => {
  const { ingredients, intent, question } = req.body

  if (!ingredients || ingredients.trim().length < 5) {
    return res.json({
      decision_summary: "Not enough information to analyze.",
      key_insights: [],
      uncertainty_note:
        "Try pasting the full ingredient list from the product label.",
      confidence_level: "High"
    })
  }

  try {
    const result = await runReasoning({
      ingredients,
      intent,
      question
    })

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      decision_summary: "Something went wrong.",
      key_insights: [],
      uncertainty_note:
        "The system could not complete this analysis.",
      confidence_level: "Low"
    })
  }
})

export default router
