// on importe les modules nécessaires
// on initialise dotenv pour lire le fichier .env
// import dotenv from "dotenv";
//stock les connexion et évite d'en recréer continuellement
import { Pool } from "pg";

// on crée une instance d'express
dotenv.config();

// on configure la connexion à la bdd avec les variables d'environnement
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// on tente de se connecter à la bdd et on affiche un message en fonction du résultat
pool
  .connect()
  .then(() => {
    console.log("🟢 Connected to the database");
  })
  .catch((err) => {
    console.error("🔴 Error connecting to the database", err);
  });
export default pool;
