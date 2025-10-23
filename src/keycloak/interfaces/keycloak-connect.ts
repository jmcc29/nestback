export interface KeycloakConnectOptions {
    authServerUrl: string;
    realm: string;
    clientId: string;
    secret?: string;
}