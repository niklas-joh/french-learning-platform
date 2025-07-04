/**
 * Data access helpers for the `content` table and related lookups.
 */
import db from '../config/db.js'; // Knex instance
import { Knex } from 'knex';


// Interface representing the Content table structure
// JSON fields are stored as strings in SQLite, so they are typed as string here.
export interface ContentSchema {
  id?: number;
  name: string;
  title?: string;
  topicId?: number | null;
  contentTypeId?: number;
  type?: string;
  questionData: string; // JSON string
  correctAnswer: string; // JSON string
  options?: string | null;
  difficultyLevel?: string | null;
  tags?: string | null;
  active?: boolean;
  createdAt?: string;
}

// Type for creating new content
export type NewContent = Omit<ContentSchema, 'id' | 'createdAt' | 'active'> & {
  title?: string;
  topicId?: number;
  questionData: any;
  correctAnswer: any;
  options?: any;
  tags?: any;
  active?: boolean;
};

// Type for content data returned to application, with JSON fields parsed
export interface ContentApplicationData {
  id: number;
  name: string;
  title: string;
  topicId?: number | null;
  type: string;
  contentTypeId?: number;
  questionData: any;
  correctAnswer: any;
  options?: any | null;
  difficultyLevel?: string | null;
  tags?: any | null;
  active: boolean;
  createdAt: string;
}

// Helper to map DB schema to application data format
function mapContentToApplicationData(content: any): ContentApplicationData {
  // With knex-stringcase, the 'content' object from the DB will already have camelCase keys.
  const questionData = JSON.parse(content.questionData);
  const correctAnswer = JSON.parse(content.correctAnswer);
  const options = content.options ? JSON.parse(content.options) : null;

  // Reconstruct the full questionData object for the client
  const fullQuestionData = {
    ...questionData,
    correctAnswer,
    options,
  };

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
    topicId: content.topicId,
    type: content.typeName || content.type || 'default',
    contentTypeId: content.contentTypeId,
    questionData: fullQuestionData,
    correctAnswer: correctAnswer,
    options: options,
    difficultyLevel: content.difficultyLevel,
    tags: content.tags ? JSON.parse(content.tags) : null,
    active: content.active !== undefined ? content.active : true,
    createdAt: content.createdAt!,
  };
}

// DRY helper to build the base query with optional joins
const buildContentQuery = () => {
  let query = db('content').select('content.*');
  // This check is a bit of a hack for schema flexibility. In a real app,
  // we'd expect the schema to be consistent.
  // TODO: Remove schema checks once DB schema is stable.
  db.schema.hasTable('content_types').then(hasTable => {
    if (hasTable) {
      db.schema.hasColumn('content', 'contentTypeId').then(hasColumn => {
        if (hasColumn) {
          query = query.leftJoin('content_types', 'content.contentTypeId', 'content_types.id').select('content_types.name as typeName');
        }
      });
    }
  });
  return query;
};

/**
 * Retrieves a single content item by id.
 */
export const getContentById = async (id: number): Promise<ContentApplicationData | null> => {
  const query = buildContentQuery();
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
  const query = buildContentQuery();
  const contentItems = await query.where({ topicId: topicId });
  return contentItems.map(mapContentToApplicationData);
};

/**
 * Inserts a new content record and returns the mapped result.
 */
export const createContent = async (contentData: NewContent): Promise<ContentApplicationData> => {
  // The translation layer will handle mapping camelCase to snake_case for the DB.
  const { correctAnswer, options, ...restOfQuestionData } = contentData.questionData || {};

  const contentToInsert: Partial<ContentSchema> = {
    name: contentData.name,
    title: contentData.title,
    topicId: contentData.topicId,
    contentTypeId: contentData.contentTypeId,
    type: contentData.type,
    questionData: JSON.stringify(restOfQuestionData),
    correctAnswer: JSON.stringify(correctAnswer),
    options: options ? JSON.stringify(options) : null,
    tags: contentData.tags ? JSON.stringify(contentData.tags) : null,
    difficultyLevel: contentData.difficultyLevel,
    active: contentData.active !== undefined ? contentData.active : true,
  };

  const [insertedContent] = await db<ContentSchema>('content').insert(contentToInsert).returning('*');
  
  if (insertedContent && insertedContent.id) {
    // We need to re-fetch to get the joined 'typeName' if it exists.
    return getContentById(insertedContent.id) as Promise<ContentApplicationData>;
  }
  throw new Error('Content creation failed, ID not returned.');
};

/**
 * Retrieves all content records.
 */
export const getAllContent = async (): Promise<ContentApplicationData[]> => {
  const query = buildContentQuery();
  const items: any[] = await query;
  return items.map(mapContentToApplicationData);
};

/**
 * Updates a content record and returns the updated version.
 */
export const updateContent = async (id: number, updateData: Partial<NewContent>): Promise<ContentApplicationData | null> => {
  const dataToUpdate: Partial<ContentSchema> = {};

  // Map application-facing names to schema names
  if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
  if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
  if (updateData.topicId !== undefined) dataToUpdate.topicId = updateData.topicId;
  if (updateData.contentTypeId !== undefined) dataToUpdate.contentTypeId = updateData.contentTypeId;
  if (updateData.type !== undefined) dataToUpdate.type = updateData.type;
  if (updateData.active !== undefined) dataToUpdate.active = updateData.active;
  if (updateData.difficultyLevel !== undefined) dataToUpdate.difficultyLevel = updateData.difficultyLevel;
  if (updateData.tags !== undefined) dataToUpdate.tags = JSON.stringify(updateData.tags);

  // Handle nested questionData
  if (updateData.questionData) {
    const { correctAnswer, options, ...restOfQuestionData } = updateData.questionData;
    dataToUpdate.questionData = JSON.stringify(restOfQuestionData);
    if (correctAnswer !== undefined) {
      dataToUpdate.correctAnswer = JSON.stringify(correctAnswer);
    }
    if (options !== undefined) {
      dataToUpdate.options = JSON.stringify(options);
    }
  }
  
  await db<ContentSchema>('content').where({ id }).update(dataToUpdate);
  
  return getContentById(id);
};

/**
 * Removes a content record.
 */
export const deleteContent = async (id: number): Promise<boolean> => {
  const count = await db<ContentSchema>('content').where({ id }).del();
  return count > 0;
};
