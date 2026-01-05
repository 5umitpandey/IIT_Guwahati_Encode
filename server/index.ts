import "dotenv/config"
import express from "express"
import cors from "cors"
import analyzeRouter from "./routes/analyze.js"


const app = express()

app.use(cors())
app.use(express.json())

app.use("/analyze", analyzeRouter)
app.get("/healthz", (_, res) => res.send("ok"))


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Food Copilot backend running on port ${PORT}`)
})
