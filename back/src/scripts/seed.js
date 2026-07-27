import fs from "fs";
import pool from "../models/configDb.js";

const seed = async () => {
  const sql = fs.readFileSync("../db/seed.sql", "utf8");
  await pool.query(sql);
};

seed();
