interface BadgrTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
}

export type BadgrTokensResponse = {
  error: boolean;
  errorMessage?: string;
  badgrTokens?: BadgrTokens;
};

enum IssuerStaffRole {
  staff,
  editor,
  owner
}

interface IssuerStaff {
  entityType: string;
  entityId: string;
  userProfile: string;
  user: string;
  role: IssuerStaffRole;
}

interface Issuer {
  entityType: string;
  entityId: string;
  openBadgeId: string;
  createdAt: string;
  createdBy: string;
  name: string;
  image: string;
  email: string;
  description: string;
  url: string;
  staff: IssuerStaffRole[];
  extensions: string;
  badgrDomain: string;
}

export type IssuersResponse = {
  error: boolean;
  errorMessage?: string;
  issuers?: Issuer[];
};

interface BadgeClassAlignment {
  targetName: string;
  targetUrl: string;
  targetDescription: string;
  targetFramework: string;
  targetCode: string;
}

interface BadgeClassExpiration {
  amount: string;
  duration: string;
}

interface BadgeClass {
  entityType: string;
  entityId: string;
  openBadgeId: string;
  createdAt: string;
  createdBy: string;
  issuer: string;
  issuerOpenBadgeId: string;
  name: string;
  image: string;
  description: string;
  criteriaUrl: string;
  criteriaNarrative: string;
  alignments: BadgeClassAlignment[];
  tags: string[];
  expires: BadgeClassExpiration;
  extensions: string;
}

export type BadgeClassesResponse = {
  error: boolean;
  errorMessage?: string;
  badgeClasses?: BadgeClass[];
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
  getIssuers(accessToken: string, entityId?: string): Promise<IssuersResponse>;

  /**
   * Get a list of BadgeClasses
   * if entityId is passed, will try to get BadgeClass of that specific entityId
   *
   * @param accessToken
   * @param entityId?
   */
  getBadgeClasses(accessToken: string, entityId?: string): Promise<BadgeClassesResponse>;
}
