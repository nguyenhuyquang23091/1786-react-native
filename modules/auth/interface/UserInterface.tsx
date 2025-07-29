export interface UserCredentials{
    email: string;
    password: string;
}
export interface CurrentUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    emailVerified: boolean;
}

