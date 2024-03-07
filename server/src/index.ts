import { config } from "dotenv";
config();

import { OAuth2Client, UserRefreshClient } from "google-auth-library";
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

// GOOGLE CALENDAR API

const { google } = require("googleapis");

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

app.post("/auth/google", async (req: Request, res: Response) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  res.json(tokens);
});

app.post("/create-event", async (req: Request, res: Response) => {
  try {
    const { summary, description, location, startDateTime, endDateTime } =
      req.body;
    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    const calendar = google.calendar("v3");
    const response = await calendar.events.insert({
      auth: oAuth2Client,
      calendarId: "primary",
      requestBody: {
        summary: summary,
        description: description,
        location: location,
        colorId: "7",
        start: {
          dateTime: new Date(startDateTime),
        },
        end: {
          dateTime: new Date(endDateTime),
        },
      },
    });
    res.send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3001, () => console.log(`server is running`));

mongoose.connect(process.env.MONGO_URL!).then(() => {
  app.listen(port, () => {
    console.log("Server Started");
  });
});
