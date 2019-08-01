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
  staff = 'staff',
  editor = 'editor',
  owner = 'owner'
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

interface Evidence {
  url: string;
  narrative: string;
}

export enum RecipientType {
  email = 'email',
  telephone = 'telephone',
  url = 'url'
}

interface Recipient {
  identity: string;
  type: RecipientType;
  hashed: boolean;
  plaintextIdentity?: string;
  salt?: string;
}

export type AwardBadgeClassData = {
  recipient: Recipient;
  expires?: string;
  evidence?: Evidence[];
};

interface BadgeClassAssertion {
  entityType: string;
  entityId: string;
  openBadgeId: string;
  createdAt: string;
  createdBy: string;
  badgeclass: string;
  badgeclassOpenBadgeId: string;
  issuer: string;
  issuerOpenBadgeId: string;
  image: string;
  recipient: Recipient;
  issuedOn: string;
  narrative: string;
  evidence: Evidence[];
  revoked: boolean;
  revocationReason: string;
  expires: string;
  extensions: string;
  badgeclassName: string;
}

export type AwardBadgeClassResponse = {
  error: boolean;
  errorMessage?: string;
  validationErrors?: any;
  fieldErrors?: any;
  badgeClassAssertion?: BadgeClassAssertion;
};

export type CreateBadgeClassData = {
  name: string;
  description: string;
  image: string;
  criteriaUrl: string;
  criteriaNarrative: string;
  tags?: string[];
  expires?: BadgeClassExpiration;
};

export type CreateBadgeClassResponse = {
  error: boolean;
  errorMessage?: string;
  validationErrors?: any;
  fieldErrors?: any;
  badgeClass?: BadgeClass;
};

export type Response = {
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
  getIssuers(accessToken: string, entityId?: string): Promise<IssuersResponse>;

  /**
   * Get a list of BadgeClasses
   * if entityId is passed, will try to get BadgeClass of that specific entityId
   *
   * @param accessToken
   * @param entityId?
   */
  getBadgeClasses(accessToken: string, entityId?: string): Promise<BadgeClassesResponse>;

  /**
   * Award a BadgeClass to a recipient
   *
   * @param accessToken
   * @param badgeClassEntityId The entityId of the BadgeClass
   * @param recipientEmail
   * @param evidenceUrl The URL to the evidence for earning this BadgeClass
   * @param evidenceNarrative The narrative for earning this BadgeClass
   * @param expires Expiration date for the assertion. ISO8601 formatted datetime stamp, e.g. 2018-11-26T13:45:00Z
   */
  awardBadgeClass(
    accessToken: string,
    badgeClassEntityId: string,
    recipientEmail: string,
    evidenceUrl?: string,
    evidenceNarrative?: string,
    expires?: string
  ): Promise<AwardBadgeClassResponse>;

  /**
   * Create a BadgeClass for an Issuer
   *
   * @param accessToken
   * @param issuerEntityId The entityId of the Issuer
   * @param name
   * @param description
   * @param image
   * @param criteriaUrl
   * @param criteriaNarrative
   * @param tags
   * @param expiresAmount
   * @param expiresDuration "days", "weeks", "months", "years"
   */
  createBadgeClass(
    accessToken: string,
    issuerEntityId: string,
    name: string,
    description: string,
    image: string,
    criteriaUrl: string,
    criteriaNarrative: string,
    tags?: string[],
    expiresAmount?: string,
    expiresDuration?: string
  ): Promise<CreateBadgeClassResponse>;

  /**
   * Delete a BadgeClass
   *
   * @param accessToken
   * @param badgeClassEntityId
   */
  deleteBadgeClass(accessToken: string, badgeClassEntityId: string): Promise<Response>;

  /**
   * Revoke an Assertion
   *
   * @param accessToken
   * @param assertionEntityId
   * @param revocationReason
   */
  revokeAssertion(accessToken: string, assertionEntityId: string, revocationReason: string): Promise<Response>;
}
