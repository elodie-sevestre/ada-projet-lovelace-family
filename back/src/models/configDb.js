import { Pool } from 'pg';
import { config } from '../../config/env.js';

// on configure la connexion à la bdd avec les variables d'environnement
const pool = new Pool({
  user: config.user,
  // (grâce au nouveau fichier config/env)
  password: config.password,
  // (grâce au nouveau fichier config/env))
  host: config.host_db || 'localhost',
  database: config.database,
  // Port ci dessous correspond à la data base
  port: config.port_db,
});

export default pool;
