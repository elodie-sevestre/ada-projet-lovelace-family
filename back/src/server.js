import express from "express";
import cors from "cors";
import usersRoutes from "./routes/usersRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/tasks", tasksRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
