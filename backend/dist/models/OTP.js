"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OTPSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: '5m' } // TTL index automatically deletes expired docs
    },
    attempts: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.OTP = mongoose_1.default.models.OTP || mongoose_1.default.model('OTP', OTPSchema);
//# sourceMappingURL=OTP.js.map