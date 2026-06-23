"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jose_1 = require("jose");
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-replace-me';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);
async function signJwt(payload) {
    return new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(encodedSecret);
}
async function verifyJwt(token) {
    try {
        const { payload } = await (0, jose_1.jwtVerify)(token, encodedSecret);
        return payload;
    }
    catch (error) {
        return null;
    }
}
//# sourceMappingURL=auth.js.map