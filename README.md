# badgr-lib

badgr-lib is a nodejs module for [badgr API](https://api.badgr.io/docs/v2)
## Usage
``` js
import BadgrLib, { BadgrTokensResponse } from "badgr-lib";
BadgrLib.getAccessTokens(USERNAME, PASSWORD)
  .then((accessToken) => {
    console.log(accessToken);
  })
  .catch((error) => {
    console.log(error);
  });
```
or using `async/await`
```js
import BadgrLib, { BadgrTokensResponse } from "badgr-lib";
(async () => {
  try {
    const accessToken: BadgrTokensResponse = await BadgrLib.getAccessTokens(USERNAME, PASSWORD);
    console.log(accessToken);
  } catch (error) {
    console.log(error);
  }
})();
```

## API

##### `getAccessTokens(username: string, password: string): Promise<BadgrTokensResponse>`

Authenticate user to get the access token.

Sample response:
```
{
  error: false,
  badgrTokens: {
    accessToken: 'Gcl2uyWQohe2FAOPZlvdMIXw8xzdt5',
    tokenType: 'Bearer',
    expiresIn: 86400,
    refreshToken: 'XOw3RGEFBRQ66Y29z0SAaaVwNg6ka6',
    scope: 'rw:profile rw:issuer rw:backpack'
  }
}
```

##### `refreshAccessTokens(refreshToken: string): Promise<BadgrTokensResponse>;`

Access tokens will expire (will only valid for 24hrs). The refresh token can be used to automatically renew an access token without requiring the password again.

Sample response:
```
{
  error: false,
  badgrTokens: {
    accessToken: 'qhaJXffun5yv7gALPqr0ya9mAtfPi0',
    tokenType: 'Bearer',
    expiresIn: 86400,
    refreshToken: 'QqrKu1tmKIm0DllbIgQrZebYoJAYqg',
    scope: 'rw:profile rw:issuer rw:backpack'
  }
}
```

##### `getIssuers(accessToken: string, entityId?: string): Promise<IssuersResponse>;`

Get a list of Issuers for authenticated user.
`entityId` is an optional param. If passed, then will get Issuer info for that specific Issuer's `entityId`.

Sample response:
```
{
  error: false,
  issuers:  [
    {
      entityType: 'Issuer',
      entityId: 'o53hys_MSIasFpFbP1GmSg',
      openBadgeId: 'https://api.badgr.io/public/issuers/o53hys_MSIasFpFbP1GmSg',
      createdAt: '2019-07-24T04:18:57Z',
      createdBy: 'r9Tkak1LR3Sbb7CC2Dl_6Q',
      name: 'Test Issuer',
      image: 'https://media.badgr.io/uploads/issuers/issuer_logo_35df6ea2-25bb-4c68-a9a9-7683351e926b.png',
      email: 'issuer@test.com',
      description: 'This is just a test',
      url: 'https://test.com/',
      staff: [
        {
          userProfile: {
            entityType: 'BadgeUser',
            entityId: 'r9Tkak1LR3Sbb7CC2Dl_6Q',
            firstName: 'First Name',
            lastName: 'Last Name',
            emails: [
              {
                email: 'issuer@test.com',
                verified: true,
                primary: true
              }
            ],
            badgrDomain: null
          },
          user: 'r9Tkak1LR3Sbb7CC2Dl_6Q',
          role: 'owner'
        }
      ],
      extensions: {},
      badgrDomain: 'badgr.io'
    }
  ]
}
```

##### `getBadgeClasses(accessToken: string, entityId?: string): Promise<BadgeClassesResponse>;`

Get a list of BadgeClasses for authenticated user.
`entityId` is an optional param. If passed, then will get BadgeClass info for that specific BadgeClass's `entityId`.

Sample response:
```
{
  error: false,
  badgeClasses: [
    {
      entityType: 'BadgeClass',
      entityId: '3RA1nsVbQXaeAtdXAYS2EQ',
      openBadgeId: 'https://api.badgr.io/public/badges/3RA1nsVbQXaeAtdXAYS2EQ',
      createdAt: '2019-07-24T04:35:24Z',
      createdBy: 'r9Tkak1LR3Sbb7CC2Dl_6Q',
      issuer: 'o53hys_MSIasFpFbP1GmSg',
      issuerOpenBadgeId: 'https://api.badgr.io/public/issuers/o53hys_MSIasFpFbP1GmSg',
      name: 'Test Badge',
      image: 'https://media.badgr.io/uploads/badges/issuer_badgeclass_4fb8fc19-f39f-4121-a2a4-6e5027a1ac8d.png',
      description: 'First test badge',
      criteriaUrl: 'https://test.com/course?id=XYZ',
      criteriaNarrative: '* User has to complete Course A or Challenge A on test.com',
      alignments: [],
      tags: [],
      expires: {
        amount: 1,
        duration: 'years'
      },
      extensions: {}
    }
  ]
}
```

##### `awardBadgeClass(accessToken: string, badgeClassEntityId: string, recipientEmail: string, evidenceUrl?: string, evidenceNarrative?: string, expires?: string): Promise<AwardBadgeClassResponse>;`

Award a BadgeClass to a recipient.
`evidenceUrl` is the URL to the evidence for earning this BadgeClass.
`evidenceNarrative` is the narrative for earning this BadgeClass.
`expires` is the expiration date of this BadgeClass. ISO8601 formatted datetime stamp, e.g. `2018-11-26T13:45:00Z`

Sample response:
```
{
  error: false,
  badgeClassAssertion: {
    entityType: 'Assertion',
    entityId: 'e7fWmjk2TjqUqZF7A3L71A',
    openBadgeId: 'https://api.badgr.io/public/assertions/e7fWmjk2TjqUqZF7A3L71A',
    createdAt: '2019-07-29T13:39:53.136537Z',
    createdBy: 'r9Tkak1LR3Sbb7CC2Dl_6Q',
    badgeclass: '3RA1nsVbQXaeAtdXAYS2EQ',
    badgeclassOpenBadgeId: 'https://api.badgr.io/public/badges/3RA1nsVbQXaeAtdXAYS2EQ',
    issuer: 'o53hys_MSIasFpFbP1GmSg',
    issuerOpenBadgeId: 'https://api.badgr.io/public/issuers/o53hys_MSIasFpFbP1GmSg',
    image: 'https://media.badgr.io/uploads/badges/assertion-e7fWmjk2TjqUqZF7A3L71A.png',
    recipient: {
      identity: 'sha256$eba30ff2f450484ca377054bb91d8595c1acee4920d2dc99c43eb82aec470e2d',
      hashed: true,
      type: 'email',
      plaintextIdentity: 'recipient@test.com',
      salt: 'c442b05be1684613b69267cda4dc23ac'
    },
    issuedOn: '2019-07-29T13:39:52.784379Z',
    narrative: null,
    evidence: [
      {
        url: 'https://test.com/course?id=XYZ1',
        narrative: 'User has completed this course'
      }
    ],
    revoked: false,
    revocationReason: null,
    expires: null,
    extensions: {}
  }
}
```

##### `createBadgeClass(accessToken: string, issuerEntityId: string, name: string, description: string, image: string, criteriaUrl: string, criteriaNarrative: string, tags?: string[], expiresAmount?: string, expiresDuration?: string): Promise<CreateBadgeClassResponse>;`

Create a new BadgeClass.
`issuerEntityId` is the entityId of the Issuer.
`image` is base-64 encoded strings and may only be PNG or SVG. For example ` data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0nmxRDwADvgGPapFGzwAAAABJRU5ErkJggg==`.
`criteriaUrl` is the URL to the criteria for earning this BadgeClass.
`criteriaNarrative` is the narrative for earning this BadgeClass.
`expiresAmount` e.g `1, 2, 10`, etc.
`expiresDuration` e.g `days, weeks, months, years`.

Sample response:
```
{
  error: false,
  badgeClass: {
    entityType: 'BadgeClass',
    entityId: 's1QPJCaoQf-mLKjcTUE42A',
    openBadgeId: 'https://api.badgr.io/public/badges/s1QPJCaoQf-mLKjcTUE42A',
    createdAt: '2019-07-29T13:44:07.414956Z',
    createdBy: 'r9Tkak1LR3Sbb7CC2Dl_6Q',
    issuer: 'o53hys_MSIasFpFbP1GmSg',
    issuerOpenBadgeId: 'https://api.badgr.io/public/issuers/o53hys_MSIasFpFbP1GmSg',
    name: 'Test Badge',
    image: 'https://media.badgr.io/uploads/badges/90a834ba-ee07-4b0e-88d3-b158251ff61d.png',
    description: 'Another test badge',
    criteriaUrl: 'https://test.com/course?id=XYZ1',
    criteriaNarrative: 'User needs to complete this course',
    alignments: [],
    tags: [ 'online badge', 'online course' ],
    expires: { amount: 1, duration: 'years' },
    extensions: {}
  }
}
```

##### `deleteBadgeClass(accessToken: string, badgeClassEntityId: string): Promise<Response>;`

Delete a BadgeClass.

Sample response:
```
{ error: false }
```

##### `revokeAssertion(accessToken: string, assertionEntityId: string, revocationReason: string): Promise<Response>;`

Revoke a recipient's awarded BadgeClass (Assertion).

Sample response:
```
{ error: false }
```
