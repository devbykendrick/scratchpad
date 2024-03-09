import { Request, Response } from "express";
import Deck from "../models/Deck";

export async function createDeckController(req: Request, res: Response) {
  const newDeck = new Deck({
    title: req.body.title,
    color: req.body.color,
    header: req.body.header,
  });
  const createdDeck = await newDeck.save();
  res.json(createdDeck);
}
