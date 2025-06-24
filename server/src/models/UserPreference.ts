/**
 * Helpers for managing persisted user preferences.
 */
import db from '../config/db';

export interface UserPreference {
    id?: number;
    user_id: number;
    preferences: string; // JSON string
    created_at?: string;
    updated_at?: string;
}

/**
 * Retrieves a preference row for the specified user.
 */
const findByUserId = (user_id: number): Promise<UserPreference | undefined> => {
    return db<UserPreference>('user_preferences').where({ user_id }).first();
};

/**
 * Inserts or updates the preference entry for a user.
 */
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

// TODO: enforce schema validation for preferences JSON

export default {
    findByUserId,
    upsert,
};
