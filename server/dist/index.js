"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./router/user"));
const messages_1 = __importDefault(require("./router/messages"));
const port = process.env.PORT;
const app = (0, express_1.default)();
// app.use(
//   cors({
//     origin: "*",
//   })
// );
app.use((0, cors_1.default)({
    origin: ["https://scratchpad-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/user", user_1.default);
app.use("/api/message", messages_1.default);
// GOOGLE CALENDAR API
const { google } = require("googleapis");
// const clientId = process.env.GOOGLE_CLIENT_ID;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "postmessage");
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
app.post("/create-event", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { summary, description, location, startDateTime, endDateTime } = req.body;
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        });
        const calendar = google.calendar("v3");
        const response = yield calendar.events.insert({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
mongoose_1.default.connect(process.env.MONGO_URL).then(() => {
    app.listen(port, () => {
        console.log("Server Started");
    });
});
