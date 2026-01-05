import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, Info, Shield, Minus } from "lucide-react"
import type { AnalysisResult } from "../types/analysis.types"

/* ---------- Props ---------- */

interface InsightCardProps {
  analysis: AnalysisResult
  isUpdating?: boolean
}

/* ---------- Icons ---------- */

function DecisionIcon({
  confidence
}: {
  confidence: AnalysisResult["confidence_level"]
}) {
  switch (confidence) {
    case "High":
      return <CheckCircle className="w-6 h-6 text-confidence-high" />
    case "Low":
      return <AlertTriangle className="w-6 h-6 text-confidence-low" />
    default:
      return <Minus className="w-6 h-6 text-confidence-moderate" />
  }
}

function InsightIcon({
  label
}: {
  label: "main-concern" | "worth-knowing" | "positive-note"
}) {
  switch (label) {
    case "main-concern":
      return <AlertTriangle className="w-4 h-4 text-confidence-low" />
    case "positive-note":
      return <CheckCircle className="w-4 h-4 text-confidence-high" />
    default:
      return <Info className="w-4 h-4 text-confidence-moderate" />
  }
}

function InsightLabel({
  label
}: {
  label: "main-concern" | "worth-knowing" | "positive-note"
}) {
  const labelConfig = {
    "main-concern": {
      text: "Main concern",
      className: "text-confidence-low bg-confidence-low/8"
    },
    "worth-knowing": {
      text: "Worth knowing",
      className: "text-confidence-moderate bg-confidence-moderate/8"
    },
    "positive-note": {
      text: "Positive note",
      className: "text-confidence-high bg-confidence-high/8"
    }
  }

  const config = labelConfig[label]

  return (
    <span
      className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${config.className}`}
    >
      {config.text}
    </span>
  )
}

function ConfidenceBadge({
  confidence
}: {
  confidence: AnalysisResult["confidence_level"]
}) {
  const colorClasses = {
    High: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
    Moderate:
      "bg-confidence-moderate/10 text-confidence-moderate border-confidence-moderate/20",
    Low: "bg-confidence-low/10 text-confidence-low border-confidence-low/20"
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${colorClasses[confidence]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          confidence === "High"
            ? "bg-confidence-high"
            : confidence === "Moderate"
            ? "bg-confidence-moderate"
            : "bg-confidence-low"
        }`}
      />
      {confidence} confidence
    </span>
  )
}

/* ---------- Main Component ---------- */

export function InsightCard({ analysis, isUpdating }: InsightCardProps) {
  const insights = analysis.key_insights ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isUpdating ? 0.6 : 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
        {/* Decision Summary */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative p-6 md:p-8 pb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-primary/[0.02] to-transparent pointer-events-none" />

          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-11 h-11 rounded-xl bg-card shadow-sm border border-border/60 flex items-center justify-center">
                <DecisionIcon confidence={analysis.confidence_level} />
              </div>
            </div>

            <h2 className="font-display text-xl md:text-2xl text-foreground leading-snug flex-1 pt-1">
  <span
    dangerouslySetInnerHTML={{
      __html: analysis.decision_summary
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    }}
  />
</h2>


          </div>
        </motion.div>

        <div className="mx-6 md:mx-8 h-px bg-border/60" />

        {/* Detected Ingredients */}
        {analysis.major_ingredients?.length > 0 && (
          <div className="px-6 md:px-8 py-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
              Detected ingredients
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.major_ingredients.map(item => (
                <span
                  key={item}
                  className="px-2 py-1 text-xs rounded-full bg-muted text-foreground/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="p-6 md:p-8 py-5 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Key insights
          </h3>

          <div className="space-y-5">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.15 + index * 0.08,
                    duration: 0.3
                  }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 mt-1">
                    <InsightIcon label={insight.label} />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <InsightLabel label={insight.label} />
                    <p
  className="text-muted-foreground leading-relaxed text-[15px]"
  dangerouslySetInnerHTML={{ __html: insight.text }}
/>

                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No notable concerns detected.
              </p>
            )}
          </div>
        </div>

        <div className="mx-6 md:mx-8 h-px bg-border/60" />

        {/* Uncertainty */}
        <div className="p-6 md:p-8 py-5">
          <div className="flex gap-3 p-4 rounded-xl bg-muted/30 border border-border/40">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/80">
                A note on our analysis
              </p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {analysis.uncertainty_note}
              </p>
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div className="p-6 md:p-8 py-4 border-t border-border/60 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Analysis confidence
          </span>
          <ConfidenceBadge confidence={analysis.confidence_level} />
        </div>
      </div>
    </motion.div>
  )
}
