"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalRouters = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const journal_controller_1 = require("./journal.controller");
const journal_validation_1 = require("./journal.validation");
const router = (0, express_1.Router)();
router.use(auth_1.default);
//==============Create Journal===============
router.post('/', (0, validateRequest_1.default)(journal_validation_1.journalValidation.createJournal), journal_controller_1.JournalControllers.createJournal);
//============Get all Journals==============
router.get('/', journal_controller_1.JournalControllers.getAllJournals);
//========Get All Journal by Date=============
router.get('/by-date', auth_1.default, journal_controller_1.JournalControllers.getJournalsByDate);
//===========Get single Journal=============
router.get('/:id', journal_controller_1.JournalControllers.getJournalById);
//=========Updat Journal===================
router.patch('/:id', (0, validateRequest_1.default)(journal_validation_1.journalValidation.updateJournal), journal_controller_1.JournalControllers.updateJournal);
//==========Delete Journal===============
router.delete('/:id', journal_controller_1.JournalControllers.deleteJournal);
exports.JournalRouters = router;
