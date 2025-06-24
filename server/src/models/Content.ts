/**
 * Data access helpers for the `content` table and related lookups.
 */
import db from '../config/db'; // Knex instance
import { Knex } from 'knex';


// Interface representing the Content table structure
// JSON fields are stored as strings in SQLite, so they are typed as string here.
// They will need to be parsed/stringified in application logic.
export interface ContentSchema {
  id?: number;
  name: string; // The name of the content item for easy identification
  title?: string; // The user-friendly display name
  topic_id?: number | null; // Foreign key, can be null if content is not topic-specific
  // Some databases use a simple "type" text column instead of a foreign key. Support both.
  content_type_id?: number; // Foreign key to content_types table
  type?: string;
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
  title?: string;
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
  title: string;
  topicId?: number | null;
  topic_id?: number | null; // legacy field name
  type: string; // The name of the content type, e.g., 'multiple-choice'
  contentTypeId?: number;

  question_data?: string; // legacy raw JSON string

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

  const typeIdMap: Record<number, string> = {
    1: 'multiple-choice',
    2: 'fill-in-the-blank',
    3: 'sentence-correction',
    4: 'true-false',
  };

  let type = content.typeName || content.type;
  if (!type && typeof content.content_type_id === 'number') {
    type = typeIdMap[content.content_type_id] || 'default';
  }
  if (!type) type = 'default';
  
  // Helper function to generate a title from a snake_case name
  const generateTitleFromName = (name: string) => {
    if (!name) return 'Untitled';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return {
    id: content.id!,
    name: content.name,
    title: content.title || generateTitleFromName(content.name),
    topicId: content.topic_id,

    topic_id: content.topic_id,
    question_data: content.question_data,

    type,
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

/**
 * Retrieves a single content item by id.
 */
export const getContentById = async (id: number): Promise<ContentApplicationData | null> => {
  const hasContentTypes = await db.schema.hasTable('content_types');
  const hasContentTypeId2 = await db.schema.hasColumn('content', 'content_type_id');
  let query = db('content').select('content.*');
  if (hasContentTypes && hasContentTypeId2) {
    query = query.leftJoin('content_types', 'content.content_type_id', 'content_types.id').select('content_types.name as typeName');
  }

  const contentItem = await query.where('content.id', id).first();
  if (!contentItem) {
    return null;
  }
  return mapContentToApplicationData(contentItem);
};

/**
 * Returns all content belonging to the provided topic id.
 */
export const getContentByTopicId = async (topicId: number): Promise<ContentApplicationData[]> => {

  const hasContentTypes = await db.schema.hasTable('content_types');
  const hasContentTypeId2 = await db.schema.hasColumn('content', 'content_type_id');
  let query = db('content').select('content.*');
  if (hasContentTypes && hasContentTypeId2) {
    query = query.leftJoin('content_types', 'content.content_type_id', 'content_types.id').select('content_types.name as typeName');
  }
  
  const contentItems = await query.where({ topic_id: topicId });
  return contentItems.map(mapContentToApplicationData);
};

/**
 * Inserts a new content record and returns the mapped result.
 */
export const createContent = async (contentData: any): Promise<ContentApplicationData> => {
  // Extract correct_answer and options from questionData if they exist
  const { correctAnswer, options, ...restOfQuestionData } = contentData.questionData || {};

  // TODO: validate contentData before insertion

  const contentToInsert: Partial<ContentSchema> = {
    name: contentData.name,
    title: contentData.title,
    topic_id: contentData.topicId,
    question_data: JSON.stringify(restOfQuestionData),
    correct_answer: JSON.stringify(correctAnswer),
    options: options ? JSON.stringify(options) : null,
    active: contentData.active !== undefined ? contentData.active : true,
  };

  const hasContentTypeId = await db.schema.hasColumn('content', 'content_type_id');
  if (hasContentTypeId) {
    contentToInsert.content_type_id = contentData.contentTypeId;
  } else {
    contentToInsert.type = contentData.type || String(contentData.contentTypeId);
  }

  const [insertedContent] = await db<ContentSchema>('content').insert(contentToInsert).returning('*');
  
  if (insertedContent && insertedContent.id) {

    const hasContentTypes = await db.schema.hasTable('content_types');
    const hasContentTypeId = await db.schema.hasColumn('content', 'content_type_id');
    let query = db('content').select('content.*');
    if (hasContentTypes && hasContentTypeId) {
      query = query.leftJoin('content_types', 'content.content_type_id', 'content_types.id').select('content_types.name as typeName');
    }

    const fullContent = await query.where('content.id', insertedContent.id).first();
    if (!fullContent) {
        throw new Error('Failed to retrieve content after creation.');
    }
    return mapContentToApplicationData(fullContent);
  }
  throw new Error('Content creation failed, ID not returned.');
};

/**
 * Retrieves all content records.
 */
export const getAllContent = async (): Promise<ContentApplicationData[]> => {

  const hasContentTypes = await db.schema.hasTable('content_types');
  const hasContentTypeId2 = await db.schema.hasColumn('content', 'content_type_id');
  let query = db('content').select('content.*');
  if (hasContentTypes && hasContentTypeId2) {
    query = query.leftJoin('content_types', 'content.content_type_id', 'content_types.id').select('content_types.name as typeName');
  }
  const items: any[] = await query;
  return items.map((item: any) => {

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

/**
 * Updates a content record and returns the updated version.
 */
export const updateContent = async (id: number, updateData: any): Promise<ContentApplicationData | null> => {
  const dataToUpdate: Partial<ContentSchema> = {};

  if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
  if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
  if (updateData.topicId !== undefined) dataToUpdate.topic_id = updateData.topicId;
  const hasContentTypeId = await db.schema.hasColumn('content', 'content_type_id');
  if (hasContentTypeId) {
    if (updateData.contentTypeId !== undefined) dataToUpdate.content_type_id = updateData.contentTypeId;
  } else if (updateData.type !== undefined) {
    dataToUpdate.type = updateData.type;
  }
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
  const hasContentTypes = await db.schema.hasTable('content_types');
  const hasContentTypeId2 = await db.schema.hasColumn('content', 'content_type_id');
  let query = db('content').select('content.*');
  if (hasContentTypes && hasContentTypeId2) {
    query = query.leftJoin('content_types', 'content.content_type_id', 'content_types.id').select('content_types.name as typeName');
  }
  const updated = await query.where('content.id', id).first();
  return updated ? mapContentToApplicationData(updated) : null;
};

/**
 * Removes a content record.
 */
export const deleteContent = async (id: number): Promise<boolean> => {
  const count = await db<ContentSchema>('content').where({ id }).del();
  return count > 0;
};
