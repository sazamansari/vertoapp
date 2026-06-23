import connectToDatabase from '../../lib/mongoose';
import { Member } from '../../models/Member';

interface GetMemberProps {
  workspaceId: string;
  userId: string;
}

export const getMember = async ({ workspaceId, userId }: GetMemberProps) => {
  await connectToDatabase();
  const member = await Member.findOne({ workspaceId, userId });
  return member;
};
