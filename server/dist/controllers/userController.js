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
exports.signupUser = exports.loginUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
function createToken(_id) {
    if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined in environment variables.");
    }
    return jsonwebtoken_1.default.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "7d" });
}
// Login user
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield userModel_1.default.login(email, password);
            // Create Token
            const token = createToken(user._id);
            res.status(200).json({ email, token });
        }
        catch (error) {
            let errorMessage = "";
            if (error && error.message) {
                errorMessage = error.message; // Use type assertion to access 'message' property
            }
            res.status(400).json({ error: errorMessage });
        }
    });
}
exports.loginUser = loginUser;
// Signup user
function signupUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            // const user = await User.signup(email, password);
            const user = yield userModel_1.default.signup(email, password);
            // Create Token
            const token = createToken(user._id);
            res.status(200).json({ email, token });
        }
        catch (error) {
            let errorMessage = "";
            if (error && error.message) {
                errorMessage = error.message; // Use type assertion to access 'message' property
            }
            res.status(400).json({ error: errorMessage });
        }
    });
}
exports.signupUser = signupUser;
