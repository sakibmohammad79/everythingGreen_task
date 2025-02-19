/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import crypto from "crypto";

// Function to verify HMAC Signature
function verifySignature(payload: string, signature: string | undefined) {
  console.log(payload, signature);
  if (!signature) return false;
  const hmac = crypto.createHmac(
    "sha256",
    process.env.WEBHOOK_SECRET as string
  );
  hmac.update(payload);
  const expectedSignature = `sha256=${hmac.digest("hex")}`;
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    // Read raw body as text
    const payload = await req.text();
    const signature = req.headers.get("x-signature");

    // Verify Signature
    if (!verifySignature(payload, signature || undefined)) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 403 }
      );
    }

    // Parse JSON Data
    const { eventType, data } = JSON.parse(payload);
    if (!eventType || !data) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    // Read existing data from db.json
    const dbFilePath = "db.json";
    let dbData: any[] = [];
    if (fs.existsSync(dbFilePath)) {
      const fileData = fs.readFileSync(dbFilePath, "utf-8");
      dbData = JSON.parse(fileData);
    }

    // Append new data
    dbData.push({ eventType, data, timestamp: new Date().toISOString() });

    // Write updated data to db.json
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));

    // Return success response
    return NextResponse.json(
      { success: true, message: "Received" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
