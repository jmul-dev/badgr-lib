# badgr-lib

badgr-lib is a nodejs module for [badgr API](https://api.badgr.io/docs/v2)
## Usage
``` js
import BadgrLib from "./";
const badgr = new BadgrLib();
badgr.getAccessTokens(USERNAME, PASSWORD)
  .then((accessToken) => {
    console.log(accessToken);
  })
  .catch((error) => {
    console.log(error);
  });
```
or using `async/await`
```js
import BadgrLib from './';
(async () => {
  const badgr = new BadgrLib();
  try {
    const accessToken = await badgr.getAccessTokens(USERNAME, PASSWORD);
    console.log(accessToken);
  } catch (error) {
    console.log(error);
  }
})();
```

## API

##### `getAccessTokens(username: string, password: string): Promise<BadgrTokensResponse>`

Authenticate user to get the access token.

##### `refreshAccessTokens(refreshToken: string): Promise<BadgrTokensResponse>;`

Access tokens will expire (will only valid for 24hrs). The refresh token can be used to automatically renew an access token without requiring the password again.

##### `getIssuers(accessToken: string, entityId?: string): Promise<IssuersResponse>;`

Get a list of Issuers for authenticated user. `entityId` is an optional param. If passed, then will get Issuer info for that specific Issuer's `entityId`.

##### `getBadgeClasses(accessToken: string, entityId?: string): Promise<BadgeClassesResponse>;`

Get a list of BadgeClasses for authenticated user. `entityId` is an optional param. If passed, then will get BadgeClass info for that specific BadgeClass's `entityId`.

##### `awardBadgeClass(accessToken: string, badgeClassEntityId: string, recipientEmail: string, evidenceUrl?: string, evidenceNarrative?: string, expires?: string): Promise<AwardBadgeClassResponse>;`

Award a BadgeClass to a recipient.
`evidenceUrl` is the URL to the evidence for earning this BadgeClass.
`evidenceNarrative` is the narrative for earning this BadgeClass.
`expires` is the expiration date of this BadgeClass. ISO8601 formatted datetime stamp, e.g. `2018-11-26T13:45:00Z`

##### `createBadgeClass(accessToken: string, issuerEntityId: string, name: string, description: string, image: string, criteriaUrl: string, criteriaNarrative: string, tags?: string[], expiresAmount?: string, expiresDuration?: string): Promise<CreateBadgeClassResponse>;`

Create a new BadgeClass.
`issuerEntityId` is the entityId of the Issuer.
`image` is base-64 encoded strings and may only be PNG or SVG. For example ` data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0nmxRDwADvgGPapFGzwAAAABJRU5ErkJggg==`.
`criteriaUrl` is the URL to the criteria for earning this BadgeClass.
`criteriaNarrative` is the narrative for earning this BadgeClass.
`expiresAmount` e.g `1, 2, 10`, etc.
`expiresDuration` e.g `days, weeks, months, years`.

##### `deleteBadgeClass(accessToken: string, badgeClassEntityId: string): Promise<Response>;`

Delete a BadgeClass.

##### `revokeAssertion(accessToken: string, assertionEntityId: string, revocationReason: string): Promise<Response>;`

Revoke a recipient's awarded BadgeClass (Assertion)
