import db from '../config/db';

export interface UserPreference {
    id?: number;
    user_id: number;
    preferences: string; // JSON string
    created_at?: string;
    updated_at?: string;
}

const findByUserId = (user_id: number): Promise<UserPreference | undefined> => {
    return db<UserPreference>('user_preferences').where({ user_id }).first();
};

const upsert = async (user_id: number, preferences: object): Promise<UserPreference> => {
    const existingPreference = await findByUserId(user_id);

    if (existingPreference) {
        const [updatedPreference] = await db<UserPreference>('user_preferences')
            .where({ user_id })
            .update({ preferences: JSON.stringify(preferences) })
            .returning('*');
        return updatedPreference;
    } else {
        const [newPreference] = await db<UserPreference>('user_preferences')
            .insert({ user_id, preferences: JSON.stringify(preferences) })
            .returning('*');
        return newPreference;
    }
};

export default {
    findByUserId,
    upsert,
};
