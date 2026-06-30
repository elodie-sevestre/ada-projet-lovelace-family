import express from "express";
import cors from "cors";
import configRoutes from "./routes/configRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/tasks", (req, res) => {
  res.json({ tasks: [] });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
