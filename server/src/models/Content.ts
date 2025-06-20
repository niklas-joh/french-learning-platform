import db from '../config/db'; // Knex instance

// Interface representing the Content table structure
// JSON fields are stored as strings in SQLite, so they are typed as string here.
// They will need to be parsed/stringified in application logic.
export interface ContentSchema {
  id?: number;
  topic_id?: number | null; // Foreign key, can be null if content is not topic-specific
  type: string; // e.g., 'multiple-choice', 'fill-in-the-blank'
  question_data: string; // JSON string
  correct_answer: string; // JSON string
  options?: string | null; // JSON string, optional
  difficulty_level?: string | null;
  tags?: string | null; // JSON string, optional
  active?: boolean; // Default 1 in schema
  created_at?: string; // Default CURRENT_TIMESTAMP in schema
}

// Type for creating new content
export type NewContent = Omit<ContentSchema, 'id' | 'created_at' | 'active'> & {
  topic_id?: number;
  question_data: any; // Allow 'any' for input, will be stringified
  correct_answer: any; // Allow 'any' for input, will be stringified
  options?: any; // Allow 'any' for input, will be stringified
  tags?: any; // Allow 'any' for input, will be stringified
  active?: boolean;
};

// Type for content data returned to application, with JSON fields parsed
export interface ContentApplicationData {
  id: number;
  topicId?: number | null;
  type: string;
  questionData: any; // Parsed JSON
  correctAnswer: any; // Parsed JSON
  options?: any | null; // Parsed JSON
  difficultyLevel?: string | null;
  tags?: any | null; // Parsed JSON
  active: boolean;
  createdAt: string;
}

// Helper to map DB schema to application data format
function mapContentToApplicationData(content: ContentSchema): ContentApplicationData {
  return {
    id: content.id!,
    topicId: content.topic_id,
    type: content.type,
    questionData: JSON.parse(content.question_data),
    correctAnswer: JSON.parse(content.correct_answer),
    options: content.options ? JSON.parse(content.options) : null,
    difficultyLevel: content.difficulty_level,
    tags: content.tags ? JSON.parse(content.tags) : null,
    active: content.active !== undefined ? content.active : true, // Default to true if undefined
    createdAt: content.created_at!,
  };
}

export const getContentById = async (id: number): Promise<ContentApplicationData | null> => {
  const contentItem: ContentSchema | undefined = await db<ContentSchema>('content').where({ id }).first();
  if (!contentItem) {
    return null;
  }
  return mapContentToApplicationData(contentItem);
};

export const getContentByTopicId = async (topicId: number): Promise<ContentApplicationData[]> => {
  const contentItems: ContentSchema[] = await db<ContentSchema>('content').where({ topic_id: topicId });
  return contentItems.map(mapContentToApplicationData);
};

export const createContent = async (contentData: NewContent): Promise<ContentApplicationData> => {
  const contentToInsert: Partial<ContentSchema> = {
    ...contentData,
    question_data: JSON.stringify(contentData.question_data),
    correct_answer: JSON.stringify(contentData.correct_answer),
    options: contentData.options ? JSON.stringify(contentData.options) : null,
    tags: contentData.tags ? JSON.stringify(contentData.tags) : null,
    active: contentData.active !== undefined ? contentData.active : true,
  };

  const [insertedContent] = await db<ContentSchema>('content').insert(contentToInsert).returning('*');
  
  if (insertedContent && insertedContent.id) {
    // Knex for SQLite might not return all fields with returning('*') for inserts.
    // Fetch the full record to ensure all data, especially defaults like created_at, is present.
    const fullContent = await db<ContentSchema>('content').where({ id: insertedContent.id }).first();
    if (!fullContent) {
        throw new Error('Failed to retrieve content after creation.');
    }
    return mapContentToApplicationData(fullContent);
  }
  throw new Error('Content creation failed, ID not returned.');
};

export const getAllContent = async (): Promise<ContentApplicationData[]> => {
  const items: ContentSchema[] = await db<ContentSchema>('content').select('*');
  return items.map(mapContentToApplicationData);
};

export const updateContent = async (id: number, updateData: Partial<NewContent>): Promise<ContentApplicationData | null> => {
  const dataToUpdate: Partial<ContentSchema> = {};
  if (updateData.topic_id !== undefined) dataToUpdate.topic_id = updateData.topic_id;
  if (updateData.type !== undefined) dataToUpdate.type = updateData.type;
  if (updateData.question_data !== undefined) dataToUpdate.question_data = JSON.stringify(updateData.question_data);
  if (updateData.correct_answer !== undefined) dataToUpdate.correct_answer = JSON.stringify(updateData.correct_answer);
  if (updateData.options !== undefined) dataToUpdate.options = updateData.options ? JSON.stringify(updateData.options) : null;
  if (updateData.difficulty_level !== undefined) dataToUpdate.difficulty_level = updateData.difficulty_level;
  if (updateData.tags !== undefined) dataToUpdate.tags = updateData.tags ? JSON.stringify(updateData.tags) : null;
  if (updateData.active !== undefined) dataToUpdate.active = updateData.active;

  await db<ContentSchema>('content').where({ id }).update(dataToUpdate);
  const updated = await db<ContentSchema>('content').where({ id }).first();
  return updated ? mapContentToApplicationData(updated) : null;
};

export const deleteContent = async (id: number): Promise<boolean> => {
  const count = await db<ContentSchema>('content').where({ id }).del();
  return count > 0;
};
