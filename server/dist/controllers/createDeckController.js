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
exports.createDeckController = void 0;
const Deck_1 = __importDefault(require("../models/Deck"));
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
function createDeckController(req, res) {
    (0, requireAuth_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const newDeck = new Deck_1.default({
                title: req.body.title,
                color: req.body.color,
                header: req.body.header,
                user_id: user_id,
            });
            const createdDeck = yield newDeck.save();
            res.json(createdDeck);
        }
        catch (error) {
            console.error("Error creating deck:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }));
}
exports.createDeckController = createDeckController;
