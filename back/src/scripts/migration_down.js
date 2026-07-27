import fs from "fs";
import pool from "../models/configDb.js";

const migrateDown = async () => {
  const sql = fs.readFileSync("../db/migration_down.sql", "utf8");
  await pool.query(sql);
};

migrateDown();
