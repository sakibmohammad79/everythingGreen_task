/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const generateToken = (user: any) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET as Secret, {
    expiresIn: "7 days",
  });
};

const verifyToken = (
  req: NextApiRequest & { user?: any },
  res: NextApiResponse,
  next: () => void
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "You are not authorized!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export { generateToken, verifyToken };
