import { RequestHandler } from "express";
import pool from "../db/setupDB";

export const getUser :RequestHandler = async (_req,res,next) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
