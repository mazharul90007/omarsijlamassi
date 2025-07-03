"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createJournal = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default
            .string({ required_error: 'Title is required!' })
            .min(1, 'Title cannot be empty'),
        content: zod_1.default
            .string({ required_error: 'Journal content is required!' })
            .min(1, 'Content can not be empty'),
    }),
});
const updateJournal = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default
            .string()
            .min(1, 'Title cannot be empty')
            .optional(),
        content: zod_1.default
            .string()
            .min(1, 'Content cannot be empty')
            .optional(),
    }).refine((data) => data.title !== undefined || data.content !== undefined, {
        message: 'At least one field (title or content) must be provided for update',
    }),
});
exports.journalValidation = { createJournal, updateJournal };
