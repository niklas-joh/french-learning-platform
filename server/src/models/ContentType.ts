import db from '../config/db';

export interface ContentType {
    id?: number;
    name: string;
    description?: string;
}

export const getAllContentTypes = async (): Promise<ContentType[]> => {
    return db<ContentType>('content_types').select('*');
};

export const createContentType = async (contentType: Omit<ContentType, 'id'>): Promise<ContentType> => {
    const [newContentType] = await db<ContentType>('content_types').insert(contentType).returning('*');
    return newContentType;
};

export const updateContentType = async (id: number, contentType: Partial<ContentType>): Promise<ContentType | null> => {
    await db<ContentType>('content_types').where({ id }).update(contentType);
    const updatedContentType = await db<ContentType>('content_types').where({ id }).first();
    return updatedContentType || null;
};

export const deleteContentType = async (id: number): Promise<boolean> => {
    const deleted = await db<ContentType>('content_types').where({ id }).del();
    return deleted > 0;
};
