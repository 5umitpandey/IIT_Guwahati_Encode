import "dotenv/config"
import express from "express"
import cors from "cors"
import analyzeRouter from "./routes/analyze.js"


const app = express()

app.use(cors())
app.use(express.json())

app.use("/analyze", analyzeRouter)

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Food Copilot backend running on http://localhost:${PORT}`)
})
