import { Router } from "express";
import express from "express";
import cors from "cors";
import usersRouter from "./usersRoutes.js";

const app = express();
const router = Router();

app.use(cors());
app.use(express.json());

router.use("/users", usersRouter);

app.use(router);

// Route de test pour vérifier que le serveur répond
router.get("/", function (req, res) {
  res.send("Hello Ada!\n");
});

const port = 5000;
app.listen(port, () => {
  console.log(`🚀 Serveur lancé : http://localhost:${port}`);
});

export default app;
