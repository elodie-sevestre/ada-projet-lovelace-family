import { Router } from "express";

const tasksRouter = Router();

tasksRouter.post("/", async (req, res) => {
  const { name, description, statut, points, created_at } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO tasks (name,description,statut,points,created_at) VALUES ($1, $2, $3, $4, $5) RETURNING*",
    [name, description, statut, points, created_at],
  );
  res.status(201).json(row[0]);
});
