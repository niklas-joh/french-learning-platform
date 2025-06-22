export interface UserPreferences {
    theme?: 'light' | 'dark';
    notifications?: {
        email?: boolean;
        sms?: boolean;
    };
}
