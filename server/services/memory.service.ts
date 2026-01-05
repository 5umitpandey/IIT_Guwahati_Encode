import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// always point to data folder relative to compiled file
const dataDir = path.join(__dirname, "../data")
const memoryPath = path.join(dataDir, "memory.json")

function ensureMemoryFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(memoryPath)) {
    fs.writeFileSync(memoryPath, "[]", "utf8")
  }
}

export function saveMemory(input: string, output: any) {
  ensureMemoryFile()

  const existing = JSON.parse(fs.readFileSync(memoryPath, "utf8"))
  existing.push({
    input: input.slice(0, 200),
    decision: output.decision_summary,
    timestamp: new Date().toISOString()
  })

  fs.writeFileSync(memoryPath, JSON.stringify(existing, null, 2))
}

export function getSimilarMemory(input: string): string[] {
  ensureMemoryFile()

  const existing = JSON.parse(fs.readFileSync(memoryPath, "utf8"))

  return existing
    .filter((d: any) => input.includes(d.input.slice(0, 20)))
    .map((d: any) => d.decision)
}