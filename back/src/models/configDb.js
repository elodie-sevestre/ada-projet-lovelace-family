// on importe les modules nécessaires
// on initialise dotenv pour lire le fichier .env
import dotenv from 'dotenv';
//stock les connexion et évite d'en recréer continuellement
import { Pool } from 'pg';
import { config } from '../../config/env.js';

//Ajout de la config .env:
// const config = require("../config/env.js");

// on crée une instance d'express
dotenv.config();

// on configure la connexion à la bdd avec les variables d'environnement
const pool = new Pool({
  user: config.user,
  // (grâce au nouveau fichier config/env)
  password: config.password,
  // (grâce au nouveau fichier config/env))
  host: config.host_db || 'localhost',
  database: config.database,
  //Port ci dessous correspond à la data base
  port: config.port_db,
});

// On tente de se connecter à la bdd et on affiche un message en fonction du résultat
pool
  .connect()
  .then(() => {
    // console.log('🟢 Connected to the database');
  })
  .catch((err) => {
    // console.error('🔴 Error connecting to the database', err);
  });
export default pool;
