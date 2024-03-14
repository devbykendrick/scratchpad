import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Model } from "mongoose";
import User, { UserDocument } from "../models/userModel";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // Use UserDocument directly
    }
  }
}

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined in environment variables.");
    }
    const { _id } = jwt.verify(token, process.env.SECRET_KEY) as {
      _id: string;
    };

    const user = await User.findOne({ _id }).select("_id");
    req.user = user as UserDocument; // Cast to UserDocument
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
}

export default requireAuth;
