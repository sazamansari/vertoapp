import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import connectToDatabase from '../lib/mongoose';
import { Member } from '../models/Member';
import { User } from '../models/User';
import { MemberRole } from '../features/members/types';

const getMember = async (workspaceId: string, userId: string) =>
  Member.findOne({ workspaceId, userId });

// GET /api/members?workspaceId=
export const getMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.query as { workspaceId: string };
    if (!workspaceId) { res.status(400).json({ error: 'workspaceId is required.' }); return; }
    await connectToDatabase();
    const member = await getMember(workspaceId, req.user._id.toString());
    if (!member) { res.status(401).json({ error: 'Unauthorized.' }); return; }

    const members = await Member.find({ workspaceId }).lean();
    const users = await User.find({ _id: { $in: members.map((m) => m.userId) } }).lean();

    const populated = members.map((m) => {
      const u = users.find((u) => u._id.toString() === m.userId.toString());
      return { $id: m._id.toString(), userId: m.userId.toString(), workspaceId: m.workspaceId.toString(), role: m.role, name: u?.name, email: u?.email };
    });

    res.json({ data: { documents: populated, total: populated.length } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

export const getMemberMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    await connectToDatabase();
    const member = await getMember(workspaceId as string, req.user._id.toString());
    
    if (!member) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    res.json({
      success: true,
      data: {
        member: {
          $id: member._id.toString(),
          role: member.role,
          workspaceId: member.workspaceId.toString(),
          userId: member.userId.toString()
        }
      }
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

// DELETE /api/members/:memberId
export const deleteMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { memberId } = req.params;
    await connectToDatabase();
    const memberToDelete = await Member.findById(memberId);
    if (!memberToDelete) { res.status(404).json({ error: 'Not found.' }); return; }

    const total = await Member.countDocuments({ workspaceId: memberToDelete.workspaceId });
    if (total === 1) { res.status(400).json({ error: 'Cannot delete the only member.' }); return; }

    const requestingMember = await getMember(memberToDelete.workspaceId.toString(), req.user._id.toString());
    if (!requestingMember) { res.status(401).json({ error: 'Unauthorized.' }); return; }
    
    // User can delete themselves (leave workspace) OR Admin can delete users
    if (requestingMember._id.toString() !== memberToDelete._id.toString() && requestingMember.role !== MemberRole.ADMIN) {
      res.status(403).json({ error: 'Forbidden. Admin privileges required.' }); return;
    }

    await Member.findByIdAndDelete(memberId);
    res.json({ data: { $id: memberId, workspaceId: memberToDelete.workspaceId.toString() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// PATCH /api/members/:memberId
export const updateMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;
    await connectToDatabase();
    const memberToUpdate = await Member.findById(memberId);
    if (!memberToUpdate) { res.status(404).json({ error: 'Not found.' }); return; }

    const total = await Member.countDocuments({ workspaceId: memberToUpdate.workspaceId });
    if (total === 1) { res.status(400).json({ error: 'Cannot downgrade the only member.' }); return; }

    const requestingMember = await getMember(memberToUpdate.workspaceId.toString(), req.user._id.toString());
    if (!requestingMember || requestingMember.role !== MemberRole.ADMIN) { 
      res.status(403).json({ error: 'Forbidden. Admin privileges required.' }); 
      return; 
    }

    await Member.findByIdAndUpdate(memberId, { role });
    res.json({ data: { $id: memberId, workspaceId: memberToUpdate.workspaceId.toString() } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};
