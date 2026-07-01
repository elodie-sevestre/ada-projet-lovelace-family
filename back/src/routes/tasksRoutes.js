import express from "express";

// ici on applique la méthode .Router() à express
// on aurait pu mettre const xxx = Router() si Router avait été explicitement importer au départ

const tasksRouter = express.Router();

// Modification tâche : deux types de modifs
// modif des champs : name, description et points
// modif du statut
// Methode HTTP : utilisation de PATCH car modif partielle
// modif via l'id

tasksRouter.put("/:id", updateTaskDetails);
tasksRouter.put("/:id/status", updateTaskStatus);
