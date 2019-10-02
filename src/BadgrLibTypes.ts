interface BadgrTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
}

export type BadgrTokensResponse = {
  error: boolean;
  errorMessage: string;
  badgrTokens: BadgrTokens;
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
  errorMessage: string;
  issuers: Issuer[];
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
  errorMessage: string;
  badgeClasses: BadgeClass[];
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
  type?: RecipientType;
  hashed?: boolean;
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

export type BadgeClassAssertionsResponse = {
  error: boolean;
  errorMessage: string;
  assertions: BadgeClassAssertion[];
};

export type AwardBadgeClassResponse = {
  error: boolean;
  errorMessage: string;
  validationErrors: any;
  fieldErrors: any;
  badgeClassAssertion: BadgeClassAssertion;
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
  errorMessage: string;
  validationErrors: any;
  fieldErrors: any;
  badgeClass: BadgeClass;
};

export type Response = {
  error: boolean;
  errorMessage: string;
};
