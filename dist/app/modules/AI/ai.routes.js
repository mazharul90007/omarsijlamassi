"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ai_controler_1 = require("./ai.controler");
const router = express_1.default.Router();
router.post('/', ai_controler_1.sendToAI);
exports.default = router;
