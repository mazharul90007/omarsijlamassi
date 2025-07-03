"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const registerUser = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: 'Name is required!' }),
        email: zod_1.default
            .string({ required_error: 'Email is required!' })
            .email({ message: 'Invalid email format!' }),
        password: zod_1.default.string({ required_error: 'Password is required!' }),
    }),
});
const updateProfile = zod_1.default.object({
    body: zod_1.default
        .object({
        name: zod_1.default.string().min(1, 'Name cannot be empty').optional(),
    })
        .refine(data => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    }),
});
const updateProfilePicture = zod_1.default.object({
// No body validation needed as it's handled by multer
});
exports.userValidation = {
    registerUser,
    updateProfile,
    updateProfilePicture,
};
