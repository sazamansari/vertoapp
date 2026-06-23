"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInviteCode = generateInviteCode;
exports.snakeCaseToTitleCase = snakeCaseToTitleCase;
function generateInviteCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
function snakeCaseToTitleCase(str) {
    return str
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
//# sourceMappingURL=utils.js.map