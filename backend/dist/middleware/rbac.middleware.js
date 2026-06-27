"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requirePermission = exports.MEMBER_PERMISSIONS = exports.ADMIN_PERMISSIONS = exports.Permission = void 0;
const Member_1 = require("../models/Member");
const types_1 = require("../features/members/types");
var Permission;
(function (Permission) {
    Permission["CREATE_WORKSPACE"] = "CREATE_WORKSPACE";
    Permission["UPDATE_WORKSPACE"] = "UPDATE_WORKSPACE";
    Permission["DELETE_WORKSPACE"] = "DELETE_WORKSPACE";
    Permission["CREATE_PROJECT"] = "CREATE_PROJECT";
    Permission["UPDATE_PROJECT"] = "UPDATE_PROJECT";
    Permission["DELETE_PROJECT"] = "DELETE_PROJECT";
    Permission["CREATE_TASK"] = "CREATE_TASK";
    Permission["UPDATE_TASK"] = "UPDATE_TASK";
    Permission["DELETE_TASK"] = "DELETE_TASK";
    Permission["MANAGE_MEMBERS"] = "MANAGE_MEMBERS";
    Permission["MANAGE_ROLES"] = "MANAGE_ROLES";
    Permission["VIEW_ANALYTICS"] = "VIEW_ANALYTICS";
    Permission["VIEW_REPORTS"] = "VIEW_REPORTS";
    Permission["USE_AI"] = "USE_AI";
    Permission["CONFIGURE_AI"] = "CONFIGURE_AI";
})(Permission || (exports.Permission = Permission = {}));
exports.ADMIN_PERMISSIONS = new Set(Object.values(Permission));
exports.MEMBER_PERMISSIONS = new Set([
    Permission.CREATE_TASK,
    Permission.UPDATE_TASK,
    Permission.USE_AI,
    Permission.VIEW_ANALYTICS, // Analytics relevant to workspace
]);
const requirePermission = (permission, getWorkspaceId) => {
    return async (req, res, next) => {
        try {
            let workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
            if (!workspaceId && getWorkspaceId) {
                workspaceId = await getWorkspaceId(req);
            }
            if (!workspaceId) {
                res.status(400).json({ error: 'workspaceId is required for RBAC' });
                return;
            }
            const member = await Member_1.Member.findOne({ workspaceId, userId: req.user._id }).lean();
            if (!member) {
                res.status(401).json({ error: 'Unauthorized.' });
                return;
            }
            const permissions = member.role === types_1.MemberRole.ADMIN ? exports.ADMIN_PERMISSIONS : exports.MEMBER_PERMISSIONS;
            if (!permissions.has(permission)) {
                res.status(403).json({ error: 'Forbidden.' });
                return;
            }
            // Attach member to request for downstream use (e.g., update task checks)
            req.member = member;
            next();
        }
        catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
};
exports.requirePermission = requirePermission;
exports.requireAdmin = (0, exports.requirePermission)(Permission.MANAGE_MEMBERS);
//# sourceMappingURL=rbac.middleware.js.map