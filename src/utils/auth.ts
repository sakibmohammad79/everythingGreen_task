/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { Secret } from "jsonwebtoken";
import { NextResponse } from "next/server";
// Generate JWT Token
export const generateToken = (user: any) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET as Secret, {
    expiresIn: "7 days",
  });
};

// Verify JWT Token
export const verifyToken = (token: string) => {
  try {
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
    return decoded; // Return decoded user info
  } catch (error) {
    console.error("Invalid token:", error);
    return null; // Return null if verification fails
  }
};
