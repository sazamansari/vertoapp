"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMember = void 0;
const mongoose_1 = __importDefault(require("../../lib/mongoose"));
const Member_1 = require("../../models/Member");
const getMember = async ({ workspaceId, userId }) => {
    await (0, mongoose_1.default)();
    const member = await Member_1.Member.findOne({ workspaceId, userId });
    return member;
};
exports.getMember = getMember;
//# sourceMappingURL=utils.js.map