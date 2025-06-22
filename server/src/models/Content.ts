import db from '../config/db'; // Knex instance

// Interface representing the Content table structure
// JSON fields are stored as strings in SQLite, so they are typed as string here.
// They will need to be parsed/stringified in application logic.
export interface ContentSchema {
  id?: number;
  name: string; // The name of the content item for easy identification
  topic_id?: number | null; // Foreign key, can be null if content is not topic-specific
  content_type_id: number; // Foreign key to content_types table
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
  name: string;
  topicId?: number | null;
  type: string; // The name of the content type, e.g., 'multiple-choice'
  contentTypeId: number;
  questionData: any; // Parsed JSON
  correctAnswer: any; // Parsed JSON
  options?: any | null; // Parsed JSON
  difficultyLevel?: string | null;
  tags?: any | null; // Parsed JSON
  active: boolean;
  createdAt: string;
}

// Helper to map DB schema to application data format
function mapContentToApplicationData(content: any): ContentApplicationData {
  const questionData = JSON.parse(content.question_data);
  const correctAnswer = JSON.parse(content.correct_answer);
  const options = content.options ? JSON.parse(content.options) : null;

  // Reconstruct the full questionData object for the client
  const fullQuestionData = {
    ...questionData,
    correctAnswer,
  };
  if (options) {
    fullQuestionData.options = options;
  }

  return {
    id: content.id!,
    name: content.name,
    topicId: content.topic_id,
    type: content.typeName || 'default', // Fallback for content without a type
    contentTypeId: content.content_type_id,
    questionData: fullQuestionData,
    // The fields below are now part of questionData, but we can keep them for now
    // for compatibility, though the frontend should primarily use questionData.
    correctAnswer: correctAnswer,
    options: options,
    difficultyLevel: content.difficulty_level,
    tags: content.tags ? JSON.parse(content.tags) : null,
    active: content.active !== undefined ? content.active : true, // Default to true if undefined
    createdAt: content.created_at!,
  };
}

const contentQuery = () => 
  db('content')
    .select('content.*', 'content_types.name as typeName')
    .leftJoin('content_types', 'content.content_type_id', 'content_types.id');


export const getContentById = async (id: number): Promise<ContentApplicationData | null> => {
  const contentItem = await contentQuery().where('content.id', id).first();
  if (!contentItem) {
    return null;
  }
  return mapContentToApplicationData(contentItem);
};

export const getContentByTopicId = async (topicId: number): Promise<ContentApplicationData[]> => {
  const contentItems = await contentQuery().where({ topic_id: topicId });
  return contentItems.map(mapContentToApplicationData);
};

export const createContent = async (contentData: any): Promise<ContentApplicationData> => {
  // Extract correct_answer and options from questionData if they exist
  const { correctAnswer, options, ...restOfQuestionData } = contentData.questionData || {};

  const contentToInsert: Partial<ContentSchema> = {
    name: contentData.name,
    topic_id: contentData.topicId,
    content_type_id: contentData.contentTypeId,
    question_data: JSON.stringify(restOfQuestionData),
    correct_answer: JSON.stringify(correctAnswer),
    options: options ? JSON.stringify(options) : null,
    active: contentData.active !== undefined ? contentData.active : true,
  };

  const [insertedContent] = await db<ContentSchema>('content').insert(contentToInsert).returning('*');
  
  if (insertedContent && insertedContent.id) {
    // Fetch the full record with the join to get all data for mapping
    const fullContent = await contentQuery().where('content.id', insertedContent.id).first();
    if (!fullContent) {
        throw new Error('Failed to retrieve content after creation.');
    }
    return mapContentToApplicationData(fullContent);
  }
  throw new Error('Content creation failed, ID not returned.');
};

export const getAllContent = async (): Promise<ContentApplicationData[]> => {
  const items = await contentQuery();
  return items.map(item => {
    try {
      return mapContentToApplicationData(item);
    } catch (error) {
      console.error('Error mapping content item:', item, error);
      // Decide how to handle the error. Skip the item, or re-throw.
      // For now, let's re-throw to see the error in the console.
      throw error;
    }
  });
};

export const updateContent = async (id: number, updateData: any): Promise<ContentApplicationData | null> => {
  const dataToUpdate: Partial<ContentSchema> = {};

  if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
  if (updateData.topicId !== undefined) dataToUpdate.topic_id = updateData.topicId;
  if (updateData.contentTypeId !== undefined) dataToUpdate.content_type_id = updateData.contentTypeId;
  if (updateData.active !== undefined) dataToUpdate.active = updateData.active;

  // Handle nested questionData
  if (updateData.questionData) {
    const { correctAnswer, options, ...restOfQuestionData } = updateData.questionData;
    dataToUpdate.question_data = JSON.stringify(restOfQuestionData);
    if (correctAnswer !== undefined) {
      dataToUpdate.correct_answer = JSON.stringify(correctAnswer);
    }
    if (options !== undefined) {
      dataToUpdate.options = JSON.stringify(options);
    }
  }
  
  await db<ContentSchema>('content').where({ id }).update(dataToUpdate);
  const updated = await contentQuery().where('content.id', id).first();
  return updated ? mapContentToApplicationData(updated) : null;
};

export const deleteContent = async (id: number): Promise<boolean> => {
  const count = await db<ContentSchema>('content').where({ id }).del();
  return count > 0;
};
