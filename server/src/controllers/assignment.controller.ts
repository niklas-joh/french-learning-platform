import { Request, Response } from 'express';
import UserContentAssignmentModel from '../models/UserContentAssignment';

export const assignContentToUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, contentId } = req.body;

  if (!userId || !contentId) {
    res.status(400).json({ message: 'userId and contentId are required' });
    return;
  }

  try {
    const assignment = await UserContentAssignmentModel.assign(userId, contentId);
    res.status(201).json(assignment);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT' || (error.message && error.message.includes('UNIQUE constraint failed'))) {
        res.status(409).json({ message: 'This content is already assigned to this user.' });
    } else {
        res.status(500).json({ message: 'Error assigning content to user', error });
    }
  }
};

export const getAssignmentsForUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const assignments = await UserContentAssignmentModel.findByUserId(Number(userId));
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments for user', error });
  }
};

export const unassignContentFromUser = async (req: Request, res: Response): Promise<void> => {
  const { assignmentId } = req.params;

  try {
    const deletedCount = await UserContentAssignmentModel.unassign(Number(assignmentId));
    if (deletedCount === 0) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error unassigning content from user', error });
  }
};
