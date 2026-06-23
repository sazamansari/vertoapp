"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const member_controller_1 = require("../controllers/member.controller");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, member_controller_1.getMembers);
router.delete('/:memberId', auth_middleware_1.authMiddleware, member_controller_1.deleteMember);
router.patch('/:memberId', auth_middleware_1.authMiddleware, member_controller_1.updateMember);
exports.default = router;
//# sourceMappingURL=member.routes.js.map