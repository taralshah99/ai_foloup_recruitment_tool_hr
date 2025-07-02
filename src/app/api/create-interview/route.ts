import { nanoid } from "nanoid";
import { v4 as uuidv4, validate as validateUUID } from "uuid";
import { NextResponse } from "next/server";
import { createInterview } from "@/services/interviews.service";
import { logger } from "@/lib/logger";

const base_url = process.env.NEXT_PUBLIC_LIVE_URL;

export async function POST(req: Request, res: Response) {
  try {
    const url_id = uuidv4();
    const url = `${base_url}/call/${url_id}`;
    const body = await req.json();

    logger.info("create-interview request received successfully");

    const payload = body.interviewData;

    let readableSlug = null;
    if (body.organizationName) {
      const interviewNameSlug = payload.name?.toLowerCase().replace(/\s/g, "-");
      const orgNameSlug = body.organizationName
        ?.toLowerCase()
        .replace(/\s/g, "-");
      readableSlug = `${orgNameSlug}-${interviewNameSlug}`;
    }

    const cleanPayload = { ...payload };
    // Only parse known JSON fields
    ["questions", "quotes", "respondents"].forEach((key) => {
      if (
        typeof cleanPayload[key] === "string" &&
        (cleanPayload[key].startsWith("{") || cleanPayload[key].startsWith("["))
      ) {
        try {
          cleanPayload[key] = JSON.parse(cleanPayload[key]);
        } catch {
          // leave as is if not valid JSON
        }
      }
    });
    // Convert empty strings to null for all fields
    Object.keys(cleanPayload).forEach((key) => {
      if (cleanPayload[key] === "") {
        cleanPayload[key] = null;
      }
    });

    // Ensure JSON fields are stringified for DB
    ["questions", "quotes", "respondents"].forEach((key) => {
      if (cleanPayload[key] !== undefined && cleanPayload[key] !== null) {
        cleanPayload[key] = JSON.stringify(cleanPayload[key]);
      }
    });

    // Force organization_id to the required UUID
    cleanPayload.organization_id = "db83fef1-ef0b-4625-8521-62760a88687a";

    // Debug logging for payload and JSON fields
    logger.info("Payload before DB insert:", JSON.stringify(cleanPayload));
    ["questions", "quotes", "respondents"].forEach((key) => {
      logger.info(`Field '${key}' type: ${typeof cleanPayload[key]}`);
      logger.info(`Field '${key}' value: ${JSON.stringify(cleanPayload[key])}`);
    });

    const newInterview = await createInterview({
      ...cleanPayload,
      url: url,
      id: url_id,
      readable_slug: readableSlug,
    });

    if (!newInterview) {
      logger.error("Interview creation failed: No row returned from DB");
      
      return NextResponse.json(
        { error: "Failed to create interview" },
        { status: 500 },
      );
    }

    logger.info("Interview created successfully");
    
    return NextResponse.json(
      { response: "Interview created successfully" },
      { status: 200 },
    );
  } catch (err) {
    logger.error("Error creating interview");

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
