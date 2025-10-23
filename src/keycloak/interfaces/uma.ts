export type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  session_state?: string;
};

export type VerifyResult = { isValid: boolean; sub?: string; exp?: number; azp?: string };

export type UmaPermissionsReq = {
  accessToken: string;
  audience: string;
  responseMode: 'permissions';
};

export type UmaDecisionReq = {
  accessToken: string;
  audience: string;
  responseMode: 'decision';
  permission: string; // "rsname#scope"
};