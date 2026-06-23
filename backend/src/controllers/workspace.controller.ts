import { Response } from 'express';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { AuthRequest } from '../middleware/auth.middleware';
import connectToDatabase from '../lib/mongoose';
import { Workspace } from '../models/Workspace';
import { Member } from '../models/Member';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { MemberRole } from '../features/members/types';
import { generateInviteCode } from '../lib/utils';
import { TaskStatus } from '../features/tasks/types';

const getMember = async (workspaceId: string, userId: string) =>
  Member.findOne({ workspaceId, userId });

const mapWorkspace = (w: any) => ({
  $id: w._id.toString(),
  name: w.name,
  imageUrl: w.imageUrl,
  inviteCode: w.inviteCode,
  userId: w.userId.toString(),
});

// GET /api/workspaces
export const getWorkspaces = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await connectToDatabase();
    const members = await Member.find({ userId: req.user._id });
    if (members.length === 0) {
      res.json({ data: { documents: [], total: 0 } });
      return;
    }
    const workspaceIds = members.map((m) => m.workspaceId);
    const workspaces = await Workspace.find({ _id: { $in: workspaceIds } }).sort({ createdAt: -1 });
    res.json({ data: { documents: workspaces.map(mapWorkspace), total: workspaces.length } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/workspaces
export const createWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    let imageUrl: string | undefined;

    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    await connectToDatabase();
    const workspace = await Workspace.create({
      name, userId: req.user._id, imageUrl, inviteCode: generateInviteCode(6),
    });
    await Member.create({ userId: req.user._id, workspaceId: workspace._id, role: MemberRole.ADMIN });

    res.json({ data: { $id: workspace._id.toString(), ...workspace.toObject() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// GET /api/workspaces/:workspaceId
export const getWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    await connectToDatabase();
    const member = await getMember(workspaceId, req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) { res.status(404).json({ error: 'Not found.' }); return; }
    res.json({ data: mapWorkspace(workspace) });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// GET /api/workspaces/:workspaceId/info
export const getWorkspaceInfo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    await connectToDatabase();
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) { res.status(404).json({ error: 'Not found.' }); return; }
    res.json({ data: { $id: workspace._id.toString(), name: workspace.name, imageUrl: workspace.imageUrl } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// PATCH /api/workspaces/:workspaceId
export const updateWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const { name } = req.body;
    await connectToDatabase();
    const member = await getMember(workspaceId, req.user._id.toString());
    if (!member || member.role !== MemberRole.ADMIN) { res.status(401).json({ error: 'Unauthorized.' }); return; }

    let imageUrl: string | undefined;
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const updateData: any = { name };
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const workspace = await Workspace.findByIdAndUpdate(workspaceId, updateData, { new: true });
    res.json({ data: { $id: workspace?._id.toString(), ...workspace?.toObject() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// DELETE /api/workspaces/:workspaceId
export const deleteWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    await connectToDatabase();
    const member = await getMember(workspaceId, req.user._id.toString());
    if (!member || member.role !== MemberRole.ADMIN) { res.status(401).json({ error: 'Unauthorized.' }); return; }
    await Member.deleteMany({ workspaceId });
    await Project.deleteMany({ workspaceId });
    await Task.deleteMany({ workspaceId });
    await Workspace.findByIdAndDelete(workspaceId);
    res.json({ data: { $id: workspaceId } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/workspaces/:workspaceId/resetInviteCode
export const resetInviteCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    await connectToDatabase();
    const member = await getMember(workspaceId, req.user._id.toString());
    if (!member || member.role !== MemberRole.ADMIN) { res.status(401).json({ error: 'Unauthorized.' }); return; }
    const workspace = await Workspace.findByIdAndUpdate(workspaceId, { inviteCode: generateInviteCode(6) }, { new: true });
    res.json({ data: { $id: workspace?._id.toString(), ...workspace?.toObject() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/workspaces/:workspaceId/join
export const joinWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const { code } = req.body;
    await connectToDatabase();
    const existing = await getMember(workspaceId, req.user._id.toString());
    if (existing) { res.status(400).json({ error: 'Already a member.' }); return; }
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace || workspace.inviteCode !== code) { res.status(400).json({ error: 'Invalid invite code.' }); return; }
    await Member.create({ workspaceId, userId: req.user._id, role: MemberRole.MEMBER });
    res.json({ data: { $id: workspace._id.toString(), ...workspace.toObject() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// GET /api/workspaces/:workspaceId/analytics
export const getWorkspaceAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    await connectToDatabase();
    const member = await getMember(workspaceId, req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const [
      thisMonthTasks, lastMonthTasks,
      thisMonthAssigned, lastMonthAssigned,
      thisMonthIncomplete, lastMonthIncomplete,
      thisMonthCompleted, lastMonthCompleted,
      thisMonthOverdue, lastMonthOverdue,
    ] = await Promise.all([
      Task.countDocuments({ workspaceId, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Task.countDocuments({ workspaceId, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      Task.countDocuments({ workspaceId, assigneeId: member._id, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Task.countDocuments({ workspaceId, assigneeId: member._id, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      Task.countDocuments({ workspaceId, status: { $ne: TaskStatus.DONE }, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Task.countDocuments({ workspaceId, status: { $ne: TaskStatus.DONE }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      Task.countDocuments({ workspaceId, status: TaskStatus.DONE, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Task.countDocuments({ workspaceId, status: TaskStatus.DONE, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      Task.countDocuments({ workspaceId, status: { $ne: TaskStatus.DONE }, dueDate: { $lt: now }, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Task.countDocuments({ workspaceId, status: { $ne: TaskStatus.DONE }, dueDate: { $lt: now }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
    ]);

    res.json({
      data: {
        taskCount: thisMonthTasks,
        taskDifference: thisMonthTasks - lastMonthTasks,
        assignedTaskCount: thisMonthAssigned,
        assignedTaskDifference: thisMonthAssigned - lastMonthAssigned,
        incompleteTaskCount: thisMonthIncomplete,
        incompleteTaskDifference: thisMonthIncomplete - lastMonthIncomplete,
        completedTaskCount: thisMonthCompleted,
        completedTaskDifference: thisMonthCompleted - lastMonthCompleted,
        overdueTaskCount: thisMonthOverdue,
        overdueTaskDifference: thisMonthOverdue - lastMonthOverdue,
      },
    });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};
