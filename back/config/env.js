// config/env.js
//Charge les valeurs contenues dans ton fichier .env et les injecte avec process.env
import dotenv from "dotenv";

// Variables obligatoires — le serveur refuse de démarrer si elles manquent
const required = [
  // 'DATABASE_URL',
  // 'JWT_SECRET',
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  // ajoute ici toutes tes variables obligatoires
];

//Méthode filter qui parcours, le tableau des variables obligatoires (required ci-dessus) et garde seulement celles qui sont absentes ou vides (process.env)
const missing = required.filter((key) => !process.env[key]);

//Condition de validation :
if (missing.length > 0) {
  console.error("");
  console.error("❌ Variables d'environnement manquantes :");
  missing.forEach((key) => console.error(` - ${key}`));
  console.error("");
  console.error(
    "👉 Copie .env.example vers .env et remplis les valeurs manquantes.",
  );
  console.error("");
  process.exit(1); //Arrête le processus Node parce qu'il y une erreur.
}

//Expose un objet de config centralisé pour que le require config en haut fonctionne et pour pouvoir les exporter
//Ici on renseigne ce qui sera utilisé ailleurs dans l'app
export const config = {
  // db: process.env.DATABASE_URL,
  // secret: process.env.JWT_SECRET,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host_db: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  //Port du back
  port_db: parseInt(process.env.POSTGRES_PORT),
  port_back: parseInt(process.env.PORT) || 5000,
  isDev: process.env.NODE_ENV !== "production",
};
