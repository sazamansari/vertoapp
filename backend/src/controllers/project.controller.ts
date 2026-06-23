import { Response } from 'express';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { AuthRequest } from '../middleware/auth.middleware';
import connectToDatabase from '../lib/mongoose';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { Member } from '../models/Member';
import { TaskStatus } from '../features/tasks/types';
import { MemberRole } from '../features/members/types';

const getMember = async (workspaceId: string, userId: string) =>
  Member.findOne({ workspaceId, userId });

// POST /api/projects
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, workspaceId } = req.body;
    await connectToDatabase();
    const member = await getMember(workspaceId, req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }

    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const project = await Project.create({ name, imageUrl, workspaceId });
    res.json({ data: { $id: project._id.toString(), ...project.toObject() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// GET /api/projects?workspaceId=
export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.query as { workspaceId: string };
    if (!workspaceId) { res.status(400).json({ error: 'workspaceId is required.' }); return; }
    await connectToDatabase();
    const member = await getMember(workspaceId, req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }
    const projects = await Project.find({ workspaceId }).sort({ createdAt: -1 }).lean();
    res.json({
      data: {
        documents: projects.map(p => ({
          $id: (p._id as any).toString(),
          name: p.name,
          imageUrl: p.imageUrl,
          workspaceId: p.workspaceId.toString(),
        })),
        total: projects.length,
      },
    });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// GET /api/projects/:projectId
export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    await connectToDatabase();
    const project = await Project.findById(projectId).lean();
    if (!project) { res.status(404).json({ error: 'Not found.' }); return; }
    const member = await getMember(project.workspaceId.toString(), req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }
    res.json({ data: { $id: (project._id as any).toString(), name: project.name, imageUrl: project.imageUrl, workspaceId: project.workspaceId.toString() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// PATCH /api/projects/:projectId
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;
    await connectToDatabase();
    const existing = await Project.findById(projectId);
    if (!existing) { res.status(404).json({ error: 'Not found.' }); return; }
    const member = await getMember(existing.workspaceId.toString(), req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }

    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const updateData: any = { name };
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const project = await Project.findByIdAndUpdate(projectId, updateData, { new: true });
    res.json({ data: { $id: project?._id.toString(), ...project?.toObject() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// DELETE /api/projects/:projectId
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    await connectToDatabase();
    const existing = await Project.findById(projectId);
    if (!existing) { res.status(404).json({ error: 'Not found.' }); return; }
    const member = await getMember(existing.workspaceId.toString(), req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }
    await Task.deleteMany({ projectId });
    await Project.findByIdAndDelete(projectId);
    res.json({ data: { $id: projectId, workspaceId: existing.workspaceId.toString() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// GET /api/projects/:projectId/analytics
export const getProjectAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    await connectToDatabase();
    const project = await Project.findById(projectId).lean();
    if (!project) { res.status(404).json({ error: 'Not found.' }); return; }
    const member = await getMember(project.workspaceId.toString(), req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const [tT, lT, tA, lA, tI, lI, tC, lC, tO, lO] = await Promise.all([
      Task.countDocuments({ projectId, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Task.countDocuments({ projectId, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      Task.countDocuments({ projectId, assigneeId: member._id, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Task.countDocuments({ projectId, assigneeId: member._id, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      Task.countDocuments({ projectId, status: { $ne: TaskStatus.DONE }, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Task.countDocuments({ projectId, status: { $ne: TaskStatus.DONE }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      Task.countDocuments({ projectId, status: TaskStatus.DONE, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Task.countDocuments({ projectId, status: TaskStatus.DONE, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      Task.countDocuments({ projectId, status: { $ne: TaskStatus.DONE }, dueDate: { $lt: now }, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Task.countDocuments({ projectId, status: { $ne: TaskStatus.DONE }, dueDate: { $lt: now }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
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
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};
