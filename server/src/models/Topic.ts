/**
 * Model utilities for the `topics` table.
 */
import db from '../config/db';

// Interface representing the Topic table structure
export interface TopicSchema {
  id?: number;
  name: string;
  description?: string | null;
  category?: string | null;
  active?: boolean; // In schema, it's BOOLEAN DEFAULT 1
  created_at?: string;
}

// Type for creating a new topic
export type NewTopic = Omit<TopicSchema, 'id' | 'created_at' | 'active'> & {
  description?: string;
  category?: string;
  active?: boolean;
};

// For now, we'll just define the interfaces and a basic retrieval function.
// More functions (create, update, delete, get by ID) can be added as needed.

/**
 * Returns all topics from the database.
 */
export const getAllTopics = async (): Promise<TopicSchema[]> => {
  return db<TopicSchema>('topics').select('*');
};

/**
 * Retrieves a topic by primary key.
 */
export const getTopicById = async (id: number): Promise<TopicSchema | null> => {
  const topic: TopicSchema | undefined = await db<TopicSchema>('topics').where({ id }).first();
  return topic || null;
};

/**
 * Finds a topic by its unique name.
 */
export const getTopicByName = async (name: string): Promise<TopicSchema | null> => {
  const topic: TopicSchema | undefined = await db<TopicSchema>('topics').where({ name }).first();
  return topic || null;
};

/**
 * Inserts a new topic row.
 */
export const createTopic = async (topicData: NewTopic): Promise<TopicSchema> => {
  const [insertedTopic] = await db<TopicSchema>('topics').insert({
    ...topicData,
    active: topicData.active !== undefined ? topicData.active : true, // Default active to true if not provided
  }).returning('*');
  // TODO: handle duplicate topic names gracefully
  
  // Fallback if returning('*') is not fully supported for all fields
  if (insertedTopic && insertedTopic.id) {
    return insertedTopic;
  }
  // This fallback is simplified; a real app might query by a unique field if ID isn't returned.
  // For topics, 'name' is unique.
  const newTopic = await db<TopicSchema>('topics').where({ name: topicData.name }).first();
  if (!newTopic) {
    throw new Error('Topic creation failed or topic not found after insert.');
  }
  return newTopic;
};
/**
 * Updates an existing topic entry.
 */
export const updateTopic = async (id: number, updateData: Partial<NewTopic>): Promise<TopicSchema | null> => {
  await db<TopicSchema>('topics').where({ id }).update(updateData);
  const updated = await db<TopicSchema>('topics').where({ id }).first();
  return updated || null;
};

/**
 * Deletes a topic by id.
 */
export const deleteTopic = async (id: number): Promise<boolean> => {
  const rowsDeleted = await db<TopicSchema>('topics').where({ id }).del();
  return rowsDeleted > 0;
};
