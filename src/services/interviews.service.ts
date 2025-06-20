"use server";
import pool from "@/lib/db";

const getAllInterviews = async (userId: string, organizationId: string) => {
  try {
    const query = `SELECT * FROM interview WHERE organization_id = $1 OR user_id = $2 ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, [organizationId, userId]);
    return rows || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getInterviewById = async (id: string) => {
  try {
    const query = `SELECT * FROM interview WHERE id = $1 OR readable_slug = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const updateInterview = async (payload: any, id: string) => {
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

const deleteInterview = async (id: string) => {
  try {
    const query = `DELETE FROM interview WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id]);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getAllRespondents = async (interviewId: string) => {
  try {
    const query = `SELECT respondents FROM interview WHERE id = $1`;
    const { rows } = await pool.query(query, [interviewId]);
    return rows || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const createInterview = async (payload: any) => {
  try {
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO interview (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const deactivateInterviewsByOrgId = async (organizationId: string) => {
  try {
    const query = `UPDATE interview SET is_active = false WHERE organization_id = $1 AND is_active = true`;
    await pool.query(query, [organizationId]);
  } catch (error) {
    console.error("Unexpected error disabling interviews:", error);
  }
};

export const InterviewService = {
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getAllRespondents,
  createInterview,
  deactivateInterviewsByOrgId,
};
