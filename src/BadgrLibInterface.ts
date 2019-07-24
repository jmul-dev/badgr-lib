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
  refreshAccessTokens(refreshToken: string): Promise<BadgrTokensResponse>;

  /**
   * Get a list of Issuers
   * if entityId is passed, will try to get Issuer of that specific entityId
   *
   * @param accessToken
   * @param entityId?
   */
  getIssuers(accessToken: string, entityId?: string): Promise<any>;

  /**
   * Get a list of BadgeClasses
   * if entityId is passed, will try to get BadgeClass of that specific entityId
   *
   * @param accessToken
   * @param entityId?
   */
  getBadgeClasses(accessToken: string, entityId?: string): Promise<any>;
}
