import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Header } from "@/components/Header"
import { InputSection } from "@/components/InputSection"
import { ThinkingState } from "@/components/ThinkingState"
import { InsightCard } from "@/components/InsightCard"
import { FollowUpChips } from "@/components/FollowUpChips"
import {
  analyzeIngredients,
  getFollowUpAnalysis,
  askCustomQuestion
} from "@/lib/mockData"


import type { AnalysisResult } from "@/types/analysis.types"



type AppState = "input" | "thinking" | "result"

const Index = () => {
  const [appState, setAppState] = useState<AppState>("input")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [ingredients, setIngredients] = useState<string>("")
  const [activeFollowUp, setActiveFollowUp] = useState<string | undefined>()
  const [isUpdatingResult, setIsUpdatingResult] = useState(false)

  /* ---------- Initial Analyze ---------- */

  const handleAnalyze = useCallback(async (text: string) => {
    setIngredients(text)
    setActiveFollowUp(undefined)
    setAppState("thinking")

    try {
      const result = await analyzeIngredients(text)
      setAnalysis(result)
      setAppState("result")
    } catch (err) {
      console.error("Analyze failed", err)
      setAppState("input")
    }
  }, [])

  /* ---------- Follow-up Chips ---------- */

  const handleFollowUp = useCallback(
    async (questionId: string) => {
      if (isUpdatingResult || !ingredients) return

      setIsUpdatingResult(true)
      setActiveFollowUp(questionId)

      try {
        const result = await getFollowUpAnalysis(questionId, ingredients)
        setAnalysis(result)
      } catch (err) {
        console.error("Follow-up failed", err)
      } finally {
        setIsUpdatingResult(false)
      }
    },
    [isUpdatingResult, ingredients]
  )

  /* ---------- Custom Question ---------- */

  const handleCustomQuestion = useCallback(
    async (question: string) => {
      if (isUpdatingResult || !ingredients) return

      setIsUpdatingResult(true)
      setActiveFollowUp("custom")

      try {
        const result = await askCustomQuestion(question, ingredients)
        setAnalysis(result)
      } catch (err) {
        console.error("Custom question failed", err)
      } finally {
        setIsUpdatingResult(false)
      }
    },
    [isUpdatingResult, ingredients]
  )

  /* ---------- Start Over ---------- */

  const handleStartOver = useCallback(() => {
    setAppState("input")
    setAnalysis(null)
    setIngredients("")
    setActiveFollowUp(undefined)
  }, [])

  /* ---------- Render ---------- */

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-4xl mx-auto pb-16">
        <Header />

        <AnimatePresence mode="wait">
          {appState === "input" && !analysis && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InputSection
                onAnalyze={handleAnalyze}
                isAnalyzing={false}
              />
            </motion.div>
          )}

          {appState === "thinking" && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ThinkingState />
            </motion.div>
          )}

          {analysis && appState === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <InsightCard
                analysis={analysis}
                isUpdating={isUpdatingResult}
              />

              <FollowUpChips
                onSelect={handleFollowUp}
                onCustomQuestion={handleCustomQuestion}
                activeId={activeFollowUp}
                disabled={isUpdatingResult}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-8"
              >
                <button
                  onClick={handleStartOver}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Analyze a different product
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center">
        <p className="text-xs text-muted-foreground/50">
          AI insights are for informational purposes only
        </p>
      </footer>
    </div>
  )
}

export default Index
