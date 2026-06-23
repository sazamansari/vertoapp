import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getMembers, deleteMember, updateMember, getMemberMe } from '../controllers/member.controller';

const router = Router();

router.get('/', authMiddleware, getMembers);
router.get('/workspace/:workspaceId/me', authMiddleware, getMemberMe);
router.delete('/:memberId', authMiddleware, deleteMember);
router.patch('/:memberId', authMiddleware, updateMember);

export default router;
