import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, Sparkles, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Tesseract from "tesseract.js"

interface InputSectionProps {
  onAnalyze: (ingredients: string) => void
  isAnalyzing: boolean
}

export function InputSection({ onAnalyze, isAnalyzing }: InputSectionProps) {
  const [ingredients, setIngredients] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [ocrText, setOcrText] = useState<string>("")
  const [isOcrRunning, setIsOcrRunning] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ---------- OCR FUNCTION ----------
  const extractTextFromImage = async (file: File) => {
    setIsOcrRunning(true)

    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: () => {}
      })

      const text = result.data.text.trim()
      setOcrText(text)
    } catch (err) {
      console.error("OCR failed", err)
      alert("Failed to read text from image. Try a clearer photo.")
    } finally {
      setIsOcrRunning(false)
    }
  }

  // ---------- IMAGE UPLOAD ----------
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    await extractTextFromImage(file)
  }

  // ---------- CLEAR IMAGE ----------
  const clearImage = () => {
    setUploadedImage(null)
    setOcrText("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // ---------- ANALYZE ----------
  const handleAnalyze = () => {
    const finalText =
      ingredients.trim().length > 0 ? ingredients : ocrText

    if (finalText.trim().length < 5) {
      alert("No readable ingredients found.")
      return
    }

    onAnalyze(finalText)
  }

  const hasContent =
    ingredients.trim().length > 0 || ocrText.trim().length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="relative">
        <div className="relative bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
          {/* Image Preview */}
          {uploadedImage && (
            <div className="relative p-4 pb-0">
              <div className="relative inline-block">
                <img
                  src={uploadedImage}
                  alt="Uploaded food label"
                  className="max-h-32 rounded-lg border border-border/50"
                />
                <button
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 p-1 bg-foreground text-background rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {isOcrRunning && (
                <p className="text-xs text-muted-foreground mt-2">
                  Reading text from image…
                </p>
              )}
            </div>
          )}

          {/* Text Area */}
          <textarea
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            placeholder="Paste ingredients list here, or upload a photo of the food label..."
            className="w-full min-h-[140px] p-5 bg-transparent resize-none focus:outline-none"
            disabled={isAnalyzing || isOcrRunning}
          />

          {/* Actions */}
          <div className="flex items-center justify-between p-4 pt-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isAnalyzing || isOcrRunning}
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing || isOcrRunning}
              className="gap-2"
            >
              {uploadedImage ? (
                <>
                  <ImageIcon className="w-4 h-4" />
                  Change image
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload label photo
                </>
              )}
            </Button>

            <Button
              onClick={handleAnalyze}
              disabled={!hasContent || isAnalyzing || isOcrRunning}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Ingredients
            </Button>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-5">
        You can paste ingredients or upload a label photo.
      </p>
    </motion.div>
  )
}
