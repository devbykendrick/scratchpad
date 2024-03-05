import express, { Request, Response } from "express";
import mongoose from "mongoose";

import Deck from "./models/Deck";

const port = 8000;
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ users: ["userOne", "userTwo", "userThree"] });
});

app.post("/decks", async (req: Request, res: Response) => {
  const newDeck = new Deck({
    title: req.body.title,
  });
  const createdDeck = await newDeck.save();
  res.json(createdDeck);
});

mongoose
  .connect(
    "mongodb+srv://devbykendrick:hYw6LWxt1PKjZV8H@cluster0.xpnbm3w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log("Server Started");
    });
  });
