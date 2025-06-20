"use server";
import pool from "@/lib/db";

const createResponse = async (payload: any) => {
  try {
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO response (${keys.join(", ")}) VALUES (${placeholders}) RETURNING id`;
    const { rows } = await pool.query(query, values);
    return rows[0]?.id;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const saveResponse = async (payload: any, call_id: string) => {
  try {
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const query = `UPDATE response SET ${setClause} WHERE call_id = $${keys.length + 1} RETURNING *`;
    const { rows } = await pool.query(query, [...values, call_id]);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getAllResponses = async (interviewId: string) => {
  try {
    const query = `SELECT * FROM response WHERE interview_id = $1 AND is_ended = true AND (details IS NULL OR details->'call_analysis' IS NOT NULL) ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, [interviewId]);
    return rows || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getResponseCountByOrganizationId = async (organizationId: string): Promise<number> => {
  try {
    const query = `SELECT COUNT(r.id) FROM interview i LEFT JOIN response r ON i.id = r.interview_id WHERE i.organization_id = $1`;
    const { rows } = await pool.query(query, [organizationId]);
    return Number(rows[0]?.count ?? 0);
  } catch (error) {
    console.error(error);
    return 0;
  }
};

const getAllEmailAddressesForInterview = async (interviewId: string) => {
  try {
    const query = `SELECT email FROM response WHERE interview_id = $1`;
    const { rows } = await pool.query(query, [interviewId]);
    return rows || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getResponseByCallId = async (id: string) => {
  try {
    const query = `SELECT * FROM response WHERE call_id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const deleteResponse = async (id: string) => {
  try {
    const query = `DELETE FROM response WHERE call_id = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id]);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const updateResponse = async (payload: any, call_id: string) => {
  try {
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const query = `UPDATE response SET ${setClause} WHERE call_id = $${keys.length + 1} RETURNING *`;
    const { rows } = await pool.query(query, [...values, call_id]);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const ResponseService = {
  createResponse,
  saveResponse,
  updateResponse,
  getAllResponses,
  getResponseByCallId,
  deleteResponse,
  getResponseCountByOrganizationId,
  getAllEmails: getAllEmailAddressesForInterview,
};
