/*
Get new access token using refresh token
POST: {{host}}/user/token-refresh
*/
export interface GetNewAccessTokenUsingRefreshToken { 
  token: string; 
}