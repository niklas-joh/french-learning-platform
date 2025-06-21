export interface Content {
  id: number;
  name: string;
  topicId: number;
  type: string; // The name of the content type
  contentTypeId: number; // The ID of the content type
  questionData: any;
  active: boolean;
  createdAt?: string;
}
