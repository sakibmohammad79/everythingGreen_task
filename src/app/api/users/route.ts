import { generateToken, verifyToken } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Handle POST request for creating a new user
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    let token;

    if (user) {
      try {
        token = generateToken(user);
      } catch (error) {
        console.log(error);
      }
    }

    const data = {
      user,
      token,
      message: "user created successfully",
    };

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "User already exists or an error occurred" },
      { status: 500 }
    );
  }
}

// Handle GET request (Fetch all users from database - protected route need exists user token)
export async function GET(req: Request) {
  // Extract and verify token
  const token = req.headers.get("authorization");
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: not provided token" },
      { status: 401 }
    );
  }

  const user = verifyToken(token as string); // Verify token
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }
  //check is user exist in database
  const isUserExists = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (!isUserExists) {
    return NextResponse.json(
      { message: "You are not valid user!" },
      { status: 401 }
    );
  }
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}
