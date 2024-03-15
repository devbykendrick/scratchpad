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
const express_1 = __importDefault(require("express"));
const getDecksController_1 = require("../controllers/getDecksController");
const deleteDeckController_1 = require("../controllers/deleteDeckController");
const createDeckController_1 = require("../controllers/createDeckController");
const Deck_1 = __importDefault(require("../models/Deck"));
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const router = express_1.default.Router();
// Require Auth for all deck routes
router.use(requireAuth_1.default);
router.get("/decks", getDecksController_1.getDecksController);
router.post("/decks", createDeckController_1.createDeckController);
router.put("/decks/:deckId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deckId = req.params.deckId;
    const { title } = req.body;
    try {
        const updatedDeck = yield Deck_1.default.findByIdAndUpdate(deckId, { title }, { new: true });
        if (!updatedDeck) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(updatedDeck);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.delete("/decks/:deckId", deleteDeckController_1.deleteDeckController);
exports.default = router;
//# sourceMappingURL=messages.js.map