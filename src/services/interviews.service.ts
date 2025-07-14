"use server";
import pool from "@/lib/db";
import { validate as validateUUID } from "uuid";
import { logger } from "@/lib/logger";

export const getAllInterviews = async () => {
  try {
    const query = `SELECT * FROM interview ORDER BY created_at DESC`;
    const { rows } = await pool.query(query);
    
    return rows || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error fetching all interviews:', errorMessage);
    throw new Error('Failed to fetch interviews');
  }
};

export const getInterviewById = async (id: string) => {
  try {
    // Validate input
    if (!id) {
      throw new Error('Interview ID is required');
    }

    let query, values;
    if (validateUUID(id)) {
      query = `SELECT * FROM interview WHERE id = $1`;
      values = [id];
    } else {
      query = `SELECT * FROM interview WHERE readable_slug = $1`;
      values = [id];
    }

    const { rows } = await pool.query(query, values);
    
    if (!rows || rows.length === 0) {
      throw new Error('Interview not found');
    }

    return rows[0];
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error fetching interview by ID:', errorMessage);
    
    if (error.message === 'Interview not found') {
      throw new Error('Interview not found');
    } else if (error.message?.includes('connection')) {
      throw new Error('Database connection error');
    } else {
      throw new Error('Failed to fetch interview');
    }
  }
};

export const updateInterview = async (payload: any, id: string) => {
  try {
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const query = `UPDATE interview SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    const { rows } = await pool.query(query, [...values, id]);
    
    return rows;
  } catch (error) {
    console.error(error);
    
    return [];
  }
};

export const deleteInterview = async (id: string) => {
  try {
    const query = `DELETE FROM interview WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id]);
    
    return rows;
  } catch (error) {
    console.error(error);
    
    return [];
  }
};

export const getAllRespondents = async (interviewId: string) => {
  try {
    const query = `SELECT respondents FROM interview WHERE id = $1`;
    const { rows } = await pool.query(query, [interviewId]);
    
    return rows || [];
  } catch (error) {
    console.error(error);
    
    return [];
  }
};

export const createInterview = async (payload: any) => {
  try {
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO interview (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await pool.query(query, values);

    if (!rows || rows.length === 0) {
      console.error("Interview insert failed: No rows returned");
      
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error creating interview:", error);
    
    return null;
  }
};

export const deactivateInterviewsByOrgId = async (organizationId: string) => {
  try {
    const query = `UPDATE interview SET is_active = false WHERE organization_id = $1 AND is_active = true`;
    await pool.query(query, [organizationId]);
  } catch (error) {
    console.error("Unexpected error disabling interviews:", error);
  }
};
