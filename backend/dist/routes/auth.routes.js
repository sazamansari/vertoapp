"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.get('/current', auth_middleware_1.authMiddleware, auth_controller_1.getCurrentUser);
router.post('/login', auth_controller_1.login);
router.post('/register', auth_controller_1.register);
router.post('/logout', auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map