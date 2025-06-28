import { Content } from './Content';

export interface UserContentAssignment {
  id: number;
  userId: number;
  contentId: number;
  assignedAt: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
}

export interface UserContentAssignmentWithContent extends UserContentAssignment {
  content: Content;
}
