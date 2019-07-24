import BadgrLibInterface, { BadgrTokensResponse } from "./BadgrLibInterface";
import * as dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';

dotenv.config();

export default class BadgrLib implements BadgrLibInterface {
  private _axios;

  constructor() {
    if (!process.env.BADGR_API_ENDPOINT) {
      throw new Error('Missing Badgr API endpoint');
    }
    this._axios = axios.create({
      baseURL: process.env.BADGR_API_ENDPOINT
    });
  }

  getAccessTokens(username: string, password: string): Promise<BadgrTokensResponse> {
    return new Promise((resolve, reject) => {
      this._axios.post(`/o/token`, qs.stringify({
          username,
          password
        }))
        .then((resp) => {
          const { data } = resp;
          const _badgrTokensResponse: BadgrTokensResponse = {
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scope: data.scope,
            error: false
          };
          resolve(_badgrTokensResponse);
        })
        .catch((err) => {
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
  }

  refreshAccessTokens(refreshToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._axios.post(`/o/token`, qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }))
        .then((resp) => {
          const { data } = resp;
          const _badgrTokensResponse: BadgrTokensResponse = {
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scope: data.scope,
            error: false
          };
          resolve(_badgrTokensResponse);
        })
        .catch((err) => {
          const _badgrTokensResponse: BadgrTokensResponse = {
            error: true
          };
          if (err.message) {
            _badgrTokensResponse.errorMessage = err.message;
          }
          reject(_badgrTokensResponse);
        });
    });
  }

}
