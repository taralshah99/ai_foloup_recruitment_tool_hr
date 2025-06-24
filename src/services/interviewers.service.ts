"use server";
import pool from "@/lib/db";

const getAllInterviewers = async (clientId: string = "") => {
  try {
    const query = `SELECT * FROM interviewer`;
    const { rows } = await pool.query(query);
    
    return rows || [];
  } catch (error) {
    console.error(error);
    
    return [];
  }
};

const createInterviewer = async (payload: any) => {
  try {
    // Check for existing interviewer with the same name and agent_id
    const checkQuery = `SELECT * FROM interviewer WHERE name = $1 AND agent_id = $2`;
    const { rows: existing } = await pool.query(checkQuery, [payload.name, payload.agent_id]);
    if (existing.length > 0) {
      console.error("An interviewer with this name already exists");
      
      return null;
    }
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const insertQuery = `INSERT INTO interviewer (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await pool.query(insertQuery, values);
    
    return rows;
  } catch (error) {
    console.error("Error creating interviewer:", error);
    
    return null;
  }
};

const getInterviewer = async (interviewerId: bigint) => {
  try {
    const query = `SELECT * FROM interviewer WHERE id = $1`;
    const { rows } = await pool.query(query, [interviewerId]);
    
    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching interviewer:", error);
    
    return null;
  }
};

export const InterviewerService = {
  getAllInterviewers,
  createInterviewer,
  getInterviewer,
};
