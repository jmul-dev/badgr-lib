import {
  BadgrTokensResponse,
  IssuersResponse,
  BadgeClassAssertionsResponse,
  BadgeClassesResponse,
  AwardBadgeClassData,
  RecipientType,
  AwardBadgeClassResponse,
  CreateBadgeClassData,
  CreateBadgeClassResponse,
  UpdateBadgeClassData,
  UpdateBadgeClassResponse,
  Response
} from './BadgrLibTypes';
import axios from 'axios';
import qs from 'qs';

const _axios = axios.create({
  baseURL: `https://api.badgr.io`
});

/**
 * Connect to badgr API and generate access tokens
 * @param username
 * @param password
 */
export const getAccessTokens = (username: string, password: string): Promise<BadgrTokensResponse> => {
  return new Promise((resolve, reject) => {
    _axios
      .post(
        `/o/token`,
        qs.stringify({
          username,
          password
        })
      )
      .then(resp => {
        const { data } = resp;
        const _badgrTokensResponse: BadgrTokensResponse = {
          error: false,
          errorMessage: '',
          badgrTokens: {
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scope: data.scope
          }
        };
        resolve(_badgrTokensResponse);
      })
      .catch(err => {
        const _badgrTokensResponse: BadgrTokensResponse = {
          error: true,
          errorMessage: err.response ? err.response.data.error_description : err.message,
          badgrTokens: {
            accessToken: '',
            tokenType: '',
            expiresIn: 0,
            refreshToken: '',
            scope: ''
          }
        };
        reject(_badgrTokensResponse);
      });
  });
};

/**
 * Refresh access tokens
 * @param refreshToken
 */
export const refreshAccessTokens = (refreshToken: string): Promise<BadgrTokensResponse> => {
  return new Promise((resolve, reject) => {
    _axios
      .post(
        `/o/token`,
        qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      )
      .then(resp => {
        const { data } = resp;
        const _badgrTokensResponse: BadgrTokensResponse = {
          error: false,
          errorMessage: '',
          badgrTokens: {
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scope: data.scope
          }
        };
        resolve(_badgrTokensResponse);
      })
      .catch(err => {
        const _badgrTokensResponse: BadgrTokensResponse = {
          error: true,
          errorMessage: err.message,
          badgrTokens: {
            accessToken: '',
            tokenType: '',
            expiresIn: 0,
            refreshToken: '',
            scope: ''
          }
        };
        reject(_badgrTokensResponse);
      });
  });
};

/**
 * Get a list of Issuers
 * if entityId is passed, will try to get Issuer of that specific entityId
 *
 * @param accessToken
 * @param entityId?
 */
export const getIssuers = (accessToken: string, entityId?: string): Promise<IssuersResponse> => {
  return new Promise((resolve, reject) => {
    _axios
      .get(`/v2/issuers${entityId ? '/' + entityId : ''}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(resp => {
        const _issuersResponse: IssuersResponse = {
          error: false,
          errorMessage: '',
          issuers: resp.data.result
        };
        resolve(_issuersResponse);
      })
      .catch(err => {
        const _issuersResponse: IssuersResponse = {
          error: true,
          errorMessage: err.response.statusText || err.message,
          issuers: []
        };
        reject(_issuersResponse);
      });
  });
};

/**
 * Get a list of BadgeClasses
 * if entityId is passed, will try to get BadgeClass of that specific entityId
 *
 * @param accessToken
 * @param entityId?
 */
export const getBadgeClasses = (accessToken: string, entityId?: string): Promise<BadgeClassesResponse> => {
  return new Promise((resolve, reject) => {
    _axios
      .get(`/v2/badgeclasses${entityId ? '/' + entityId : ''}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(resp => {
        const _badgeClassesResponse: BadgeClassesResponse = {
          error: false,
          errorMessage: '',
          badgeClasses: resp.data.result
        };
        resolve(_badgeClassesResponse);
      })
      .catch(err => {
        const _badgeClassesResponse: BadgeClassesResponse = {
          error: true,
          errorMessage: err.response.statusText || err.message,
          badgeClasses: []
        };
        reject(_badgeClassesResponse);
      });
  });
};

/**
 * Get a list of Assertions for a single BadgeClass
 *
 * @param accessToken
 * @param entityId
 */
export const getBadgeClassAssertions = (
  accessToken: string,
  entityId: string
): Promise<BadgeClassAssertionsResponse> => {
  return new Promise((resolve, reject) => {
    _axios
      .get(`/v2/badgeclasses/${entityId}/assertions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(resp => {
        const _badgeClassAssertionsResponse: BadgeClassAssertionsResponse = {
          error: false,
          errorMessage: '',
          assertions: resp.data.result
        };
        resolve(_badgeClassAssertionsResponse);
      })
      .catch(err => {
        const _badgeClassAssertionsResponse: BadgeClassAssertionsResponse = {
          error: true,
          errorMessage: err.response.statusText || err.message,
          assertions: []
        };
        reject(_badgeClassAssertionsResponse);
      });
  });
};

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
export const awardBadgeClass = (
  accessToken: string,
  badgeClassEntityId: string,
  recipientEmail: string,
  evidenceUrl?: string,
  evidenceNarrative?: string,
  expires?: string
): Promise<AwardBadgeClassResponse> => {
  return new Promise((resolve, reject) => {
    const _data: AwardBadgeClassData = {
      recipient: {
        identity: recipientEmail,
        type: RecipientType.email,
        hashed: true
      }
    };
    if (evidenceUrl && evidenceNarrative) {
      _data.evidence = [{ url: evidenceUrl, narrative: evidenceNarrative }];
    }
    if (expires) _data.expires = expires;
    _axios
      .post(`/v2/badgeclasses/${badgeClassEntityId}/assertions`, _data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(resp => {
        const _awardBadgeClassResponse: AwardBadgeClassResponse = {
          error: false,
          errorMessage: '',
          validationErrors: [],
          fieldErrors: [],
          badgeClassAssertion: resp.data.result[0]
        };
        resolve(_awardBadgeClassResponse);
      })
      .catch(err => {
        const _awardBadgeClassResponse: AwardBadgeClassResponse = {
          error: true,
          errorMessage: err.response.data.status.description || err.message,
          validationErrors: err.response.data.validationErrors || [],
          fieldErrors: err.response.data.fieldErrors || [],
          badgeClassAssertion: {
            entityType: '',
            entityId: '',
            openBadgeId: '',
            createdAt: '',
            createdBy: '',
            badgeclass: '',
            badgeclassOpenBadgeId: '',
            issuer: '',
            issuerOpenBadgeId: '',
            image: '',
            recipient: {
              identity: ''
            },
            issuedOn: '',
            narrative: '',
            evidence: [],
            revoked: false,
            revocationReason: '',
            expires: '',
            extensions: '',
            badgeclassName: ''
          }
        };
        reject(_awardBadgeClassResponse);
      });
  });
};

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
export const createBadgeClass = (
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
): Promise<CreateBadgeClassResponse> => {
  return new Promise((resolve, reject) => {
    const _data: CreateBadgeClassData = {
      name,
      description,
      image,
      criteriaUrl,
      criteriaNarrative
    };
    if (tags.length) {
      _data.tags = tags;
    }
    if (expiresAmount && expiresDuration) {
      _data.expires = {
        amount: expiresAmount,
        duration: expiresDuration
      };
    }
    _axios
      .post(`/v2/issuers/${issuerEntityId}/badgeclasses`, _data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(resp => {
        const _createBadgeClassResponse: CreateBadgeClassResponse = {
          error: false,
          errorMessage: '',
          validationErrors: [],
          fieldErrors: [],
          badgeClass: resp.data.result[0]
        };
        resolve(_createBadgeClassResponse);
      })
      .catch(err => {
        const _createBadgeClassResponse: CreateBadgeClassResponse = {
          error: true,
          errorMessage: err.response.data.status.description || err.message,
          validationErrors: err.response.data.validationErrors || [],
          fieldErrors: err.response.data.fieldErrors || [],
          badgeClass: {
            entityType: '',
            entityId: '',
            openBadgeId: '',
            createdAt: '',
            createdBy: '',
            issuer: '',
            issuerOpenBadgeId: '',
            name: '',
            image: '',
            description: '',
            criteriaUrl: '',
            criteriaNarrative: '',
            alignments: [],
            tags: [],
            expires: {
              amount: '',
              duration: ''
            },
            extensions: ''
          }
        };
        reject(_createBadgeClassResponse);
      });
  });
};

/**
 * Update a BadgeClass
 *
 * @param accessToken
 * @param badgeClassEntityId
 * @param name
 * @param description
 * @param image
 * @param criteriaUrl
 * @param criteriaNarrative
 * @param tags
 * @param expiresAmount
 * @param expiresDuration "days", "weeks", "months", "years"
 */
export const updateBadgeClass = (
  accessToken: string,
  badgeClassEntityId: string,
  name: string,
  description: string,
  image: string,
  criteriaUrl: string,
  criteriaNarrative: string,
  tags?: string[],
  expiresAmount?: string,
  expiresDuration?: string
): Promise<UpdateBadgeClassResponse> => {
  return new Promise((resolve, reject) => {
    const _data: UpdateBadgeClassData = {
      name,
      description,
      image,
      criteriaUrl,
      criteriaNarrative
    };
    if (tags.length) {
      _data.tags = tags;
    }
    if (expiresAmount && expiresDuration) {
      _data.expires = {
        amount: expiresAmount,
        duration: expiresDuration
      };
    }
    _axios
      .put(`/v2/badgeclasses/${badgeClassEntityId}`, _data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(resp => {
        const _updateBadgeClassResponse: UpdateBadgeClassResponse = {
          error: false,
          errorMessage: '',
          validationErrors: [],
          fieldErrors: [],
          badgeClass: resp.data.result[0]
        };
        resolve(_updateBadgeClassResponse);
      })
      .catch(err => {
        const _updateBadgeClassResponse: UpdateBadgeClassResponse = {
          error: true,
          errorMessage: err.response.data.status.description || err.message,
          validationErrors: err.response.data.validationErrors || [],
          fieldErrors: err.response.data.fieldErrors || [],
          badgeClass: {
            entityType: '',
            entityId: '',
            openBadgeId: '',
            createdAt: '',
            createdBy: '',
            issuer: '',
            issuerOpenBadgeId: '',
            name: '',
            image: '',
            description: '',
            criteriaUrl: '',
            criteriaNarrative: '',
            alignments: [],
            tags: [],
            expires: {
              amount: '',
              duration: ''
            },
            extensions: ''
          }
        };
        reject(_updateBadgeClassResponse);
      });
  });
};

/**
 * Delete a BadgeClass
 *
 * @param accessToken
 * @param badgeClassEntityId
 */
export const deleteBadgeClass = (accessToken: string, badgeClassEntityId: string): Promise<Response> => {
  return new Promise((resolve, reject) => {
    _axios
      .delete(`/v2/badgeclasses/${badgeClassEntityId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(resp => {
        const _deleteBadgeClassResponse: Response = {
          error: false,
          errorMessage: ''
        };
        resolve(_deleteBadgeClassResponse);
      })
      .catch(err => {
        const _deleteBadgeClassResponse: Response = {
          error: true,
          errorMessage: err.response.statusText || err.message
        };
        reject(_deleteBadgeClassResponse);
      });
  });
};

/**
 * Revoke an Assertion
 *
 * @param accessToken
 * @param assertionEntityId
 * @param revocationReason
 */
export const revokeAssertion = (
  accessToken: string,
  assertionEntityId: string,
  revocationReason: string
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    _axios
      .delete(`/v2/assertions/${assertionEntityId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: {
          revocation_reason: revocationReason
        }
      })
      .then(resp => {
        const _revokeAssertionResponse: Response = {
          error: false,
          errorMessage: ''
        };
        resolve(_revokeAssertionResponse);
      })
      .catch(err => {
        const _revokeAssertionResponse: Response = {
          error: true,
          errorMessage: err.response.statusText || err.message
        };
        reject(_revokeAssertionResponse);
      });
  });
};
