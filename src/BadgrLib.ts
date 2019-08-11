import {
  BadgrTokensResponse,
  IssuersResponse,
  BadgeClassesResponse,
  AwardBadgeClassData,
  RecipientType,
  AwardBadgeClassResponse,
  CreateBadgeClassData,
  CreateBadgeClassResponse,
  Response
} from './BadgrLibInterface';
import axios from 'axios';
import qs from 'qs';

const _axios = axios.create({
  baseURL: `https://api.badgr.io`
});

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
          error: true
        };
        if (err.response) {
          _badgrTokensResponse.errorMessage = err.response.data.error_description;
        } else {
          _badgrTokensResponse.errorMessage = err.message;
        }
        reject(_badgrTokensResponse);
      });
  });
};

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
          error: true
        };
        if (err.message) {
          _badgrTokensResponse.errorMessage = err.message;
        }
        reject(_badgrTokensResponse);
      });
  });
};

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
          issuers: resp.data.result
        };
        resolve(_issuersResponse);
      })
      .catch(err => {
        const _issuersResponse: IssuersResponse = {
          error: true,
          errorMessage: err.response.statusText || err.message
        };
        reject(_issuersResponse);
      });
  });
};

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
          badgeClasses: resp.data.result
        };
        resolve(_badgeClassesResponse);
      })
      .catch(err => {
        const _badgeClassesResponse: BadgeClassesResponse = {
          error: true,
          errorMessage: err.response.statusText || err.message
        };
        reject(_badgeClassesResponse);
      });
  });
};

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
          badgeClassAssertion: resp.data.result[0]
        };
        resolve(_awardBadgeClassResponse);
      })
      .catch(err => {
        const _awardBadgeClassResponse: AwardBadgeClassResponse = {
          error: true
        };
        if (err.response) {
          _awardBadgeClassResponse.errorMessage = err.response.data.status.description;
          if (err.response.data.validationErrors.length) {
            _awardBadgeClassResponse.validationErrors = err.response.data.validationErrors;
          }
          if (err.response.data.fieldErrors) {
            _awardBadgeClassResponse.fieldErrors = err.response.data.fieldErrors;
          }
        } else {
          _awardBadgeClassResponse.errorMessage = err.message;
        }
        reject(_awardBadgeClassResponse);
      });
  });
};

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
          badgeClass: resp.data.result[0]
        };
        resolve(_createBadgeClassResponse);
      })
      .catch(err => {
        const _createBadgeClassResponse: CreateBadgeClassResponse = {
          error: true
        };

        if (err.response) {
          _createBadgeClassResponse.errorMessage = err.response.data.status.description;
          if (err.response.data.validationErrors.length) {
            _createBadgeClassResponse.validationErrors = err.response.data.validationErrors;
          }
          if (err.response.data.fieldErrors) {
            _createBadgeClassResponse.fieldErrors = err.response.data.fieldErrors;
          }
        } else {
          _createBadgeClassResponse.errorMessage = err.message;
        }
        reject(_createBadgeClassResponse);
      });
  });
};

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
          error: false
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
          error: false
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
