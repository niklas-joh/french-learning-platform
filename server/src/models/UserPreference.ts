/**
 * Helpers for managing persisted user preferences.
 */
import db from '../config/db.js';

export interface UserPreference {
    id?: number;
    userId: number;
    preferences: string; // JSON string
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Retrieves a preference row for the specified user.
 */
const findByUserId = (userId: number): Promise<UserPreference | undefined> => {
    return db<UserPreference>('userPreferences').where({ userId }).first();
};

/**
 * Inserts or updates the preference entry for a user.
 */
const upsert = async (userId: number, preferences: object): Promise<UserPreference> => {
    const existingPreference = await findByUserId(userId);

    if (existingPreference) {
        const [updatedPreference] = await db<UserPreference>('userPreferences')
            .where({ userId })
            .update({ preferences: JSON.stringify(preferences) })
            .returning('*');
        return updatedPreference;
    } else {
        const [newPreference] = await db<UserPreference>('userPreferences')
            .insert({ userId, preferences: JSON.stringify(preferences) })
            .returning('*');
        return newPreference;
    }
};

// TODO: enforce schema validation for preferences JSON

export default {
    findByUserId,
    upsert,
};
