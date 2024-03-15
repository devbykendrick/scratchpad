import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/userModel";

function createToken(_id: any) {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables.");
  }
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "7d" });
}

// Login user
export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await (User as any as { login: Function }).login(
      email,
      password
    );

    // Create Token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    let errorMessage = "";
    if (error && (error as any).message) {
      errorMessage = (error as any).message; // Use type assertion to access 'message' property
    }
    res.status(400).json({ error: errorMessage });
  }
}

// Signup user
export async function signupUser(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    // const user = await User.signup(email, password);
    const user = await (User as any as { signup: Function }).signup(
      email,
      password
    );

    // Create Token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    let errorMessage = "";
    if (error && (error as any).message) {
      errorMessage = (error as any).message; // Use type assertion to access 'message' property
    }
    res.status(400).json({ error: errorMessage });
  }
}
