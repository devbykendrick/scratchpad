import { Request, Response } from "express";
import Deck from "../models/Deck";
import requireAuth from "../middleware/requireAuth";

export async function getDecksController(req: Request, res: Response) {
  requireAuth(req, res, async () => {
    try {
      const user_id = req.user?._id;

      const decks = await Deck.find({ user_id });
      res.json(decks);
    } catch (error) {
      console.error("Error creating deck:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
