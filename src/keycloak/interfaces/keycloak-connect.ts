export interface KeycloakConnectOptions {
    authServerUrl: string;
    realm: string;
    clientId: string;
    secret?: string;
}

export interface KeycloakRequest {
    accessToken: string;
    clientId: string;
    audience?: string;
    responseMode?: string;
    returnUrl?: string;
    redirectUri?: string;
}
