export type BadgrTokensResponse = {
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  refreshToken?: string;
  scope?: string;
  error: boolean;
  errorMessage?: string;
};

export default interface BadgrLibInterface {
  /**
   * Connect to badgr API and generate access tokens
   * @param username
   * @param password
   */
  getAccessTokens(username: string, password: string): Promise<BadgrTokensResponse>;

  /**
   * Refresh access tokens
   * @param refreshToken
   */
  refreshAccessTokens(refreshToken: string): Promise<any>;
}
