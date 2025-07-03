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
exports.JournalService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const truncateText_1 = require("../../utils/truncateText");
// ==========Create Journal==============
const createJournal = (_a) => __awaiter(void 0, [_a], void 0, function* ({ title, content, userId, dreamPatterns, // This should be a JSON object, e.g. { adventure: 30, ... }
 }) {
    const journal = yield prisma_1.default.journal.create({
        data: {
            title,
            content,
            userId,
            dreamPatterns,
        },
    });
    return journal;
});
//==========Get All Journal===============
const getAllJournals = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const journals = yield prisma_1.default.journal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
    // Truncate content for each journal
    const journalsWithTruncatedContent = journals.map(journal => (Object.assign(Object.assign({}, journal), { content: (0, truncateText_1.truncateText)(journal.content, 150) })));
    return journalsWithTruncatedContent;
});
//===========Get Journal By Id===========
const getJournalById = (journalId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const journal = yield prisma_1.default.journal.findFirst({
        where: { id: journalId, userId },
    });
    if (!journal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Journal not found');
    }
    return journal;
});
//==========Get All Journal by Date===============
const getJournalsByDate = (userId, date) => __awaiter(void 0, void 0, void 0, function* () {
    // Parse the date string to a Date object
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    // Query journals created on that date
    const journals = yield prisma_1.default.journal.findMany({
        where: {
            userId,
            createdAt: {
                gte: start,
                lt: end,
            },
        },
        orderBy: { createdAt: 'desc' },
    });
    return journals;
});
//===========Update Journal =============
const updateJournal = (journalId, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const journal = yield prisma_1.default.journal.findFirst({
        where: { id: journalId, userId },
    });
    if (!journal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Journal not found');
    }
    const updatedJournal = yield prisma_1.default.journal.update({
        where: { id: journalId },
        data: payload,
    });
    return updatedJournal;
});
//=============Delete Journal===============
const deleteJournal = (journalId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const journal = yield prisma_1.default.journal.findFirst({
        where: { id: journalId, userId },
    });
    if (!journal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Journal not found');
    }
    yield prisma_1.default.journal.delete({
        where: { id: journalId },
    });
});
exports.JournalService = {
    createJournal,
    getAllJournals,
    getJournalById,
    updateJournal,
    deleteJournal,
    getJournalsByDate,
};
