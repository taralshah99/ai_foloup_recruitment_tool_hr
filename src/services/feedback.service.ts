"use server";
import pool from "@/lib/db";
import { FeedbackData } from "@/types/response";

const submitFeedback = async (feedbackData: FeedbackData) => {
  try {
    const keys = Object.keys(feedbackData);
    const values = Object.values(feedbackData);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO feedback (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

export const FeedbackService = {
  submitFeedback,
};
