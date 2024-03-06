import { config } from "dotenv";
config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import Deck from "./models/Deck";
import { getDecksController } from "./controllers/getDecksController";
import { createDeckController } from "./controllers/createDeckController";
import { deleteDeckController } from "./controllers/deleteDeckController";

const port = 8000;
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/decks", getDecksController);

app.post("/decks", createDeckController);

app.put("/decks/:deckId", async (req: Request, res: Response) => {
  const deckId = req.params.deckId;
  const { title } = req.body;

  try {
    // Update the user in MongoDB
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

app.delete("/decks/:deckId", deleteDeckController);

mongoose.connect(process.env.MONGO_URL!).then(() => {
  app.listen(port, () => {
    console.log("Server Started");
  });
});
