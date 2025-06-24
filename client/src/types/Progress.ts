export interface TopicProgress {
  topicId: number;
  topicName: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export interface AssignedContentProgress {
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export interface UserOverallProgress {
  topicProgress: TopicProgress[];
  assignedContentProgress: AssignedContentProgress;
}
