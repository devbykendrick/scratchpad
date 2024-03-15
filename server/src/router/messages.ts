import express, { Request, Response } from "express";
import { getDecksController } from "../controllers/getDecksController";
import { deleteDeckController } from "../controllers/deleteDeckController";
import { createDeckController } from "../controllers/createDeckController";
import Deck from "../models/Deck";
import requireAuth from "../middleware/requireAuth";

const router = express.Router();

// Require Auth for all deck routes
router.use(requireAuth);

router.get("/decks", getDecksController);
router.post("/decks", createDeckController);
router.put("/decks/:deckId", async (req: Request, res: Response) => {
  const deckId = req.params.deckId;
  const { title } = req.body;

  try {
    const updatedDeck = await Deck.findByIdAndUpdate(
      deckId,
      { title },
      { new: true }
    );

    if (!updatedDeck) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(updatedDeck);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/decks/:deckId", deleteDeckController);

export default router;
