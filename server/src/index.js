
import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "TalentFlow API",
  });
});

app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found.",
  });
});

app.listen(port, () => {
  console.log(`TalentFlow API running on port ${port}`);
});
