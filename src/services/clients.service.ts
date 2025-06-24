"use server";
import pool from "@/lib/db";

const updateOrganization = async (payload: any, id: string) => {
  try {
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const query = `UPDATE organization SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    const { rows } = await pool.query(query, [...values, id]);
    
    return rows;
  } catch (error) {
    console.error(error);
    
    return [];
  }
};

const getClientById = async (
  id: string,
  email?: string | null,
  organization_id?: string | null,
) => {
  try {
    let query = `SELECT * FROM "user" WHERE id = $1`;
    let { rows } = await pool.query(query, [id]);
    if (!rows || (rows.length === 0 && email)) {
      const insertQuery = `INSERT INTO "user" (id, email, organization_id) VALUES ($1, $2, $3) RETURNING *`;
      const insertRes = await pool.query(insertQuery, [id, email, organization_id]);
      
      return insertRes.rows[0] || null;
    }
    if (organization_id && rows[0].organization_id !== organization_id) {
      const updateQuery = `UPDATE "user" SET organization_id = $1 WHERE id = $2 RETURNING *`;
      const updateRes = await pool.query(updateQuery, [organization_id, id]);
      
      return updateRes.rows[0] || null;
    }
    
    return rows[0] || null;
  } catch (error) {
    console.error(error);
    
    return [];
  }
};

const getOrganizationById = async (
  organization_id?: string,
  organization_name?: string,
) => {
  try {
    let query = `SELECT * FROM organization WHERE id = $1`;
    let { rows } = await pool.query(query, [organization_id]);
    if (!rows || rows.length === 0) {
      const insertQuery = `INSERT INTO organization (id, name) VALUES ($1, $2) RETURNING *`;
      const insertRes = await pool.query(insertQuery, [organization_id, organization_name]);
      
      return insertRes.rows[0] || null;
    }
    if (organization_name && rows[0].name !== organization_name) {
      const updateQuery = `UPDATE organization SET name = $1 WHERE id = $2 RETURNING *`;
      const updateRes = await pool.query(updateQuery, [organization_name, organization_id]);
      
      return updateRes.rows[0] || null;
    }
    
    return rows[0] || null;
  } catch (error) {
    console.error(error);
    
    return [];
  }
};

export const ClientService = {
  updateOrganization,
  getClientById,
  getOrganizationById,
};
