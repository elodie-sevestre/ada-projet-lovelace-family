import fs from "fs";
import pool from "../models/configDb.js";

const migrateUp = async () => {
  const sql = fs.readFileSync("../db/migration_up.sql", "utf8");
  await pool.query(sql);
};

migrateUp();
