import { verifyToken } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Handle GET request to fetch user by ID (Protected Route)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    //  Extract user ID from params
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Extract and verify token
    const token = req.headers.get("authorization");

    const decodedUser = verifyToken(token as string); // Verify token

    if (!decodedUser) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    //check valid user
    const decodedUserId = decodedUser?.userId;
    if (decodedUserId !== id) {
      return NextResponse.json(
        { message: "You are not valid user" },
        { status: 401 }
      );
    }

    //  Fetch user from database
    const foundUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!foundUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(foundUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    );
  }
}
