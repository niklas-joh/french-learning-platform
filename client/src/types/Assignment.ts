import { Content } from './Content';

export interface UserContentAssignment {
  id: number;
  user_id: number;
  content_id: number;
  assigned_at: Date;
  status: 'pending' | 'completed';
}

export interface UserContentAssignmentWithContent extends UserContentAssignment {
  content: Content;
}
