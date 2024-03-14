import { config } from "dotenv";
config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./router/user";
import messageRoutes from "./router/messages";

import { UserRefreshClient } from "google-auth-library";

const port = 8000;
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

// GOOGLE CALENDAR API
const { google } = require("googleapis");

// const clientId = process.env.GOOGLE_CLIENT_ID;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

// app.post("/auth/google", async (req: Request, res: Response) => {
//   const { tokens } = await oauth2Client.getToken(req.body.code); // exchange code for tokens
//   console.log(tokens);

//   res.json(tokens);
// });

// app.post("/auth/google/refresh-token", async (req, res) => {
//   const user = new UserRefreshClient(
//     clientId,
//     clientSecret,
//     req.body.refreshToken
//   );
//   const { credentials } = await user.refreshAccessToken(); // optain new tokens
//   res.json(credentials);
// });

app.post("/create-event", async (req: Request, res: Response) => {
  try {
    const { summary, description, location, startDateTime, endDateTime } =
      req.body;
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    const calendar = google.calendar("v3");
    const response = await calendar.events.insert({
      auth: oauth2Client,
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
