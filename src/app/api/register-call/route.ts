import { logger } from "@/lib/logger";
import { getInterviewer } from "@/services/interviewers.service";
import { NextResponse } from "next/server";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function POST(req: Request, res: Response) {
  logger.info("register-call request received");

  try {
    if (!process.env.RETELL_API_KEY) {
      logger.error("Retell API key is not configured");

      return NextResponse.json(
        {
          error: "Service configuration error. Please contact support.",
          details: "API key not configured"
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const interviewerId = body.interviewer_id;
    const interviewer = await getInterviewer(interviewerId);

    if (!interviewer) {
      logger.error(`Interviewer not found with ID: ${interviewerId}`);

      return NextResponse.json(
        {
          error: "Invalid interview configuration",
          details: "Interviewer not found"
        },
        { status: 404 }
      );
    }

    try {
      const registerCallResponse = await retellClient.call.createWebCall({
        agent_id: interviewer.agent_id,
        retell_llm_dynamic_variables: body.dynamic_data,
      });

      logger.info("Call registered successfully");

      return NextResponse.json(
        {
          registerCallResponse,
        },
        { status: 200 }
      );
    } catch (retellError) {
      const errorMessage = retellError instanceof Error ? retellError.message : 'Unknown error';
      logger.error("Retell API error:", errorMessage);

      return NextResponse.json(
        {
          error: "Failed to initialize interview",
          details: "Service temporarily unavailable"
        },
        { status: 503 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error("Unexpected error in register-call:", errorMessage);

    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: "Please try again later"
      },
      { status: 500 }
    );
  }
}
