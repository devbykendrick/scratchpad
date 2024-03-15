"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
// Define the user schema
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
// Static signup method
userSchema.statics.signup = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validation
        if (!email || !password) {
            throw Error("All fields must be filled");
        }
        if (!validator_1.default.isEmail(email)) {
            throw Error("Email is not valid");
        }
        if (!validator_1.default.isStrongPassword(password)) {
            throw Error("Password not strong enough");
        }
        const exists = yield this.findOne({ email });
        if (exists) {
            throw Error("Email already in use");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const user = yield this.create({ email, password: hash });
        return user;
    });
};
// Static login method
userSchema.statics.login = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validation
        if (!email || !password) {
            throw Error("All fields must be filled");
        }
        const user = yield this.findOne({ email });
        if (!user) {
            throw Error("Incorrect email");
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            throw Error("Incorrect password");
        }
        return user;
    });
};
// Create and export the User model
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map