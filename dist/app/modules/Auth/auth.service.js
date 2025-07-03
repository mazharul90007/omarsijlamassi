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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AuthServices = void 0;
const bcrypt = __importStar(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const generateToken_1 = require("../../utils/generateToken");
const jwt = __importStar(require("jsonwebtoken"));
//==========================Login User=========================
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            isActive: true,
        },
    });
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Password incorrect');
    }
    // if (!userData.isEmailVerified) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     'Email is not verified, Please check your email for the verification link.',
    //   );
    // }
    const accessToken = yield (0, generateToken_1.generateToken)({ id: userData.id, email: userData.email }, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    const refreshToken = yield (0, generateToken_1.generateToken)({ id: userData.id }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    yield prisma_1.default.user.update({
        where: { id: userData.id },
        data: { refreshToken },
    });
    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        accessToken,
        refreshToken,
    };
});
//====================Refresh Access Token===================
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jwt.verify(refreshToken, config_1.default.jwt.refresh_secret);
    const user = yield prisma_1.default.user.findFirst({
        where: {
            id: decoded.id,
            refreshToken: refreshToken,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid refresh token');
    }
    const newAccessToken = yield (0, generateToken_1.generateToken)({ id: user.id, email: user.email }, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    return { accessToken: newAccessToken };
});
//================Logout User========================
const logoutUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
});
exports.AuthServices = { loginUserFromDB, refreshAccessToken, logoutUser };
