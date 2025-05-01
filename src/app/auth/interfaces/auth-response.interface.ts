export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    refreshExpiresIn: number;
    sessionState: string;
    scope: string;
}