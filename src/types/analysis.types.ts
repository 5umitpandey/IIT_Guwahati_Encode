export interface AnalysisResult {
  decision_summary: string

  // Ingredients detected from OCR / text input
  major_ingredients?: string[]

  // Core insights shown to the user
  key_insights: {
    label: "main-concern" | "worth-knowing" | "positive-note"
    text: string
  }[]

  // Transparency + uncertainty
  uncertainty_note: string

  // Confidence shown in UI
  confidence_level: "High" | "Moderate" | "Low"
}
