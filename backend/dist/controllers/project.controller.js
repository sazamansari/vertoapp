"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectAnalytics = exports.deleteProject = exports.updateProject = exports.getProject = exports.getProjects = exports.createProject = void 0;
const date_fns_1 = require("date-fns");
const mongoose_1 = __importDefault(require("../lib/mongoose"));
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
const Member_1 = require("../models/Member");
const types_1 = require("../features/tasks/types");
const getMember = async (workspaceId, userId) => Member_1.Member.findOne({ workspaceId, userId });
// POST /api/projects
const createProject = async (req, res) => {
    try {
        const { name, workspaceId } = req.body;
        await (0, mongoose_1.default)();
        const member = await getMember(workspaceId, req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        let imageUrl;
        if (req.file) {
            imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }
        else if (req.body.image) {
            imageUrl = req.body.image;
        }
        const project = await Project_1.Project.create({ name, imageUrl, workspaceId });
        res.json({ data: { $id: project._id.toString(), ...project.toObject() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.createProject = createProject;
// GET /api/projects?workspaceId=
const getProjects = async (req, res) => {
    try {
        const { workspaceId } = req.query;
        if (!workspaceId) {
            res.status(400).json({ error: 'workspaceId is required.' });
            return;
        }
        await (0, mongoose_1.default)();
        const member = await getMember(workspaceId, req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        const projects = await Project_1.Project.find({ workspaceId }).sort({ createdAt: -1 }).lean();
        res.json({
            data: {
                documents: projects.map(p => ({
                    $id: p._id.toString(),
                    name: p.name,
                    imageUrl: p.imageUrl,
                    workspaceId: p.workspaceId.toString(),
                })),
                total: projects.length,
            },
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getProjects = getProjects;
// GET /api/projects/:projectId
const getProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        await (0, mongoose_1.default)();
        const project = await Project_1.Project.findById(projectId).lean();
        if (!project) {
            res.status(404).json({ error: 'Not found.' });
            return;
        }
        const member = await getMember(project.workspaceId.toString(), req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        res.json({ data: { $id: project._id.toString(), name: project.name, imageUrl: project.imageUrl, workspaceId: project.workspaceId.toString() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getProject = getProject;
// PATCH /api/projects/:projectId
const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name } = req.body;
        await (0, mongoose_1.default)();
        const existing = await Project_1.Project.findById(projectId);
        if (!existing) {
            res.status(404).json({ error: 'Not found.' });
            return;
        }
        const member = await getMember(existing.workspaceId.toString(), req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        let imageUrl;
        if (req.file) {
            imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }
        else if (req.body.image) {
            imageUrl = req.body.image;
        }
        const updateData = { name };
        if (imageUrl !== undefined)
            updateData.imageUrl = imageUrl;
        const project = await Project_1.Project.findByIdAndUpdate(projectId, updateData, { new: true });
        res.json({ data: { $id: project?._id.toString(), ...project?.toObject() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.updateProject = updateProject;
// DELETE /api/projects/:projectId
const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        await (0, mongoose_1.default)();
        const existing = await Project_1.Project.findById(projectId);
        if (!existing) {
            res.status(404).json({ error: 'Not found.' });
            return;
        }
        const member = await getMember(existing.workspaceId.toString(), req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        await Task_1.Task.deleteMany({ projectId });
        await Project_1.Project.findByIdAndDelete(projectId);
        res.json({ data: { $id: projectId, workspaceId: existing.workspaceId.toString() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.deleteProject = deleteProject;
// GET /api/projects/:projectId/analytics
const getProjectAnalytics = async (req, res) => {
    try {
        const { projectId } = req.params;
        await (0, mongoose_1.default)();
        const project = await Project_1.Project.findById(projectId).lean();
        if (!project) {
            res.status(404).json({ error: 'Not found.' });
            return;
        }
        const member = await getMember(project.workspaceId.toString(), req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        const now = new Date();
        const thisMonthStart = (0, date_fns_1.startOfMonth)(now);
        const thisMonthEnd = (0, date_fns_1.endOfMonth)(now);
        const lastMonthStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const lastMonthEnd = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const [tT, lT, tA, lA, tI, lI, tC, lC, tO, lO] = await Promise.all([
            Task_1.Task.countDocuments({ projectId, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Task_1.Task.countDocuments({ projectId, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            Task_1.Task.countDocuments({ projectId, assigneeId: member._id, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Task_1.Task.countDocuments({ projectId, assigneeId: member._id, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            Task_1.Task.countDocuments({ projectId, status: { $ne: types_1.TaskStatus.DONE }, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Task_1.Task.countDocuments({ projectId, status: { $ne: types_1.TaskStatus.DONE }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            Task_1.Task.countDocuments({ projectId, status: types_1.TaskStatus.DONE, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Task_1.Task.countDocuments({ projectId, status: types_1.TaskStatus.DONE, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            Task_1.Task.countDocuments({ projectId, status: { $ne: types_1.TaskStatus.DONE }, dueDate: { $lt: now }, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Task_1.Task.countDocuments({ projectId, status: { $ne: types_1.TaskStatus.DONE }, dueDate: { $lt: now }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
        ]);
        res.json({
            data: {
                taskCount: tT, taskDifference: tT - lT,
                assignedTaskCount: tA, assignedTaskDifference: tA - lA,
                incompleteTaskCount: tI, incompleteTaskDifference: tI - lI,
                completedTaskCount: tC, completedTaskDifference: tC - lC,
                overdueTaskCount: tO, overdueTaskDifference: tO - lO,
            },
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getProjectAnalytics = getProjectAnalytics;
//# sourceMappingURL=project.controller.js.map