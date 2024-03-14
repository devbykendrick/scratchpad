import { Request, Response } from "express";
import Deck from "../models/Deck";
import requireAuth from "../middleware/requireAuth";

export function createDeckController(req: Request, res: Response) {
  requireAuth(req, res, async () => {
    try {
      const user_id = req.user?._id;
      const newDeck = new Deck({
        title: req.body.title,
        color: req.body.color,
        header: req.body.header,
        user_id: user_id,
      });
      console.log(user_id);

      const createdDeck = await newDeck.save();
      res.json(createdDeck);
    } catch (error) {
      console.error("Error creating deck:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
