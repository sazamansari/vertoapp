import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import connectToDatabase from '../lib/mongoose';
import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { Member, MemberRole } from '../models/Member';
import { User } from '../models/User';
import { TaskStatus } from '../features/tasks/types';

const getMember = async (workspaceId: string, userId: string) =>
  Member.findOne({ workspaceId, userId });

const mapTask = (task: any, project: any, assignee: any) => ({
  $id: task._id.toString(),
  name: task.name,
  status: task.status,
  position: task.position,
  dueDate: task.dueDate?.toISOString?.() ?? task.dueDate,
  description: task.description,
  workspaceId: task.workspaceId.toString(),
  projectId: task.projectId.toString(),
  assigneeId: task.assigneeId.toString(),
  // PredictFlow extra fields
  priority: task.priority,
  complexity: task.complexity,
  storyPoints: task.storyPoints,
  labels: task.labels,
  project: project
    ? { $id: project._id.toString(), name: project.name, imageUrl: project.imageUrl, workspaceId: project.workspaceId.toString() }
    : null,
  assignee,
});

// GET /api/tasks
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId, projectId, assigneeId, status, search, dueDate } = req.query as any;
    if (!workspaceId) { res.status(400).json({ error: 'workspaceId is required.' }); return; }

    await connectToDatabase();
    const member = await getMember(workspaceId, req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }

    const query: any = { workspaceId };
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (assigneeId) query.assigneeId = assigneeId;
    if (dueDate) query.dueDate = new Date(dueDate);
    if (search) query.name = { $regex: search, $options: 'i' };

    const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();
    const projectIds = [...new Set(tasks.map((t) => t.projectId.toString()))];
    const assigneeIds = [...new Set(tasks.map((t) => t.assigneeId.toString()))];

    const [projects, members] = await Promise.all([
      Project.find({ _id: { $in: projectIds } }).lean(),
      Member.find({ _id: { $in: assigneeIds } }).lean(),
    ]);
    const users = await User.find({ _id: { $in: members.map((m) => m.userId) } }).lean();

    const assigneesMap: Record<string, any> = {};
    members.forEach((m) => {
      const u = users.find((u) => u._id.toString() === m.userId.toString());
      assigneesMap[m._id.toString()] = { $id: m._id.toString(), name: u?.name, email: u?.email, userId: m.userId.toString(), workspaceId: m.workspaceId.toString(), role: m.role };
    });
    const projectsMap: Record<string, any> = {};
    projects.forEach((p) => { projectsMap[p._id.toString()] = p; });

    const populatedTasks = tasks.map((t) =>
      mapTask(t, projectsMap[t.projectId.toString()], assigneesMap[t.assigneeId.toString()])
    );

    res.json({ data: { documents: populatedTasks, total: populatedTasks.length } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// GET /api/tasks/:taskId
export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    await connectToDatabase();
    const task = await Task.findById(taskId).lean();
    if (!task) { res.status(404).json({ error: 'Task not found' }); return; }
    const member = await getMember(task.workspaceId.toString(), req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }
    const [project, assigneeMember] = await Promise.all([
      Project.findById(task.projectId).lean(),
      Member.findById(task.assigneeId).lean(),
    ]);
    let assignee = null;
    if (assigneeMember) {
      const u = await User.findById(assigneeMember.userId).lean();
      if (u) assignee = { $id: assigneeMember._id.toString(), name: u.name, email: u.email, userId: assigneeMember.userId.toString(), workspaceId: assigneeMember.workspaceId.toString(), role: assigneeMember.role };
    }
    res.json({ data: mapTask(task, project, assignee) });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/tasks
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, status, workspaceId, projectId, dueDate, assigneeId, priority, complexity, storyPoints, labels } = req.body;
    await connectToDatabase();
    const member = await getMember(workspaceId, req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }

    const highestPositionTask = await Task.findOne({ status, workspaceId }).sort({ position: -1 }).lean();
    const position = highestPositionTask ? (highestPositionTask as any).position + 1000 : 1000;

    const task = await Task.create({
      name, status, workspaceId, projectId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assigneeId, position,
      priority, complexity, storyPoints, labels,
    });
    res.json({ data: { $id: task._id.toString(), ...task.toObject() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// PATCH /api/tasks/:taskId
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    await connectToDatabase();
    const existing = await Task.findById(taskId).lean();
    if (!existing) { res.status(404).json({ error: 'Task not found' }); return; }
    
    // Member is attached by rbac.middleware.ts, but we'll fetch just in case it's missed
    const member = req.member || await getMember(existing.workspaceId.toString(), req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }

    if (member.role === MemberRole.MEMBER && existing.assigneeId.toString() !== member._id.toString()) {
      res.status(403).json({ error: 'Forbidden. You can only update your own tasks.' });
      return;
    }

    const { name, status, description, projectId, dueDate, assigneeId, priority, complexity, storyPoints, labels } = req.body;
    
    // Prevent members from reassigning tasks to others
    if (member.role === MemberRole.MEMBER && assigneeId && assigneeId !== member._id.toString()) {
      res.status(403).json({ error: 'Forbidden. You cannot reassign your tasks.' });
      return;
    }

    const updateData: any = { name, status, projectId, assigneeId, description, priority, complexity, storyPoints, labels };
    if (dueDate) updateData.dueDate = new Date(dueDate);

    // Remove undefined keys
    Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k]);

    const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
    res.json({ data: { $id: task?._id.toString(), ...task?.toObject() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// DELETE /api/tasks/:taskId
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    await connectToDatabase();
    const task = await Task.findById(taskId).lean();
    if (!task) { res.status(404).json({ error: 'Task not found' }); return; }
    const member = await getMember(task.workspaceId.toString(), req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }
    await Task.findByIdAndDelete(taskId);
    res.json({ data: { $id: taskId, workspaceId: task.workspaceId.toString(), projectId: task.projectId.toString() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/tasks/bulk-update
export const bulkUpdateTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tasks } = req.body;
    await connectToDatabase();
    const taskIds = tasks.map((t: any) => t.$id);
    const tasksToUpdate = await Task.find({ _id: { $in: taskIds } }).lean();
    
    if (tasksToUpdate.length === 0) { res.json({ data: { updatedTasks: [] } }); return; }

    const workspaceIds = new Set(tasksToUpdate.map((t) => t.workspaceId.toString()));
    if (workspaceIds.size !== 1) { res.status(400).json({ error: 'All tasks must belong to the same workspace.' }); return; }
    const workspaceId = [...workspaceIds][0];
    const member = req.member || await getMember(workspaceId, req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }

    if (member.role === MemberRole.MEMBER) {
      const unauthorizedTask = tasksToUpdate.find(t => t.assigneeId.toString() !== member._id.toString());
      if (unauthorizedTask) {
        res.status(403).json({ error: 'Forbidden. You can only update your own tasks.' });
        return;
      }
    }

    const updatedTasks = await Promise.all(
      tasks.map(async (t: any) => Task.findByIdAndUpdate(t.$id, { status: t.status, position: t.position }, { new: true }))
    );
    res.json({ data: { updatedTasks, workspaceId } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};
