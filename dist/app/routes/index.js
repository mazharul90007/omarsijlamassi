"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
// import { JournalRouters } from '../modules/Journal/journal.route';
const ai_routes_1 = __importDefault(require("../modules/AI/ai.routes"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.UserRouters,
    },
    {
        path: '/auth',
        route: auth_routes_1.AuthRouters,
    },
    // {
    //   path: '/journal',
    //   route: JournalRouters,
    // },
    {
        path: '/ai',
        route: ai_routes_1.default,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
