import db from '../config/db.js';

export interface Topic {
    id?: number;
    name: string;
    description?: string;
}

export const getAllTopics = async (): Promise<Topic[]> => {
    return db<Topic>('topics').select('*');
};

export const createTopic = async (topic: Omit<Topic, 'id'>): Promise<Topic> => {
    const [newTopic] = await db<Topic>('topics').insert(topic).returning('*');
    return newTopic;
};

export const getTopicById = async (id: number): Promise<Topic | null> => {
    const topic = await db<Topic>('topics').where({ id }).first();
    return topic || null;
};

export const updateTopicById = async (id: number, topic: Partial<Topic>): Promise<Topic | null> => {
    await db<Topic>('topics').where({ id }).update(topic);
    const updatedTopic = await getTopicById(id);
    return updatedTopic;
};

export const deleteTopicById = async (id: number): Promise<boolean> => {
    const deleted = await db<Topic>('topics').where({ id }).del();
    return deleted > 0;
};
