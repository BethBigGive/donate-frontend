// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts`.
// The list of file replacements can be found in `angular.json`.

// see also src/app/featureFlags.ts

import { Environment } from './environment.interface';

export const environment: Environment = {
  environmentId: "development",
  production: false,
  productionLike: false,
  creditTipsCampaign: 'a056900002LDXWgAAP',
  apiUriPrefix: 'https://sf-api-staging.thebiggivetest.org.uk',
  creditDonationsEnabled: true, // Whether the donation start page offers credit for settlement. Credit purchase page is always available.
  donateGlobalUriPrefix: 'http://localhost:4200',
  donateUriPrefix: 'http://localhost:4200',
  blogUriPrefix: 'http://localhost:30003',
  experienceUriPrefix: 'https://thebiggive--full.sandbox.my.site.com',
  donationsApiPrefix: 'http://localhost:30030/v1',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-3',
  googleOptimizeId: null,
  // googleOptimizeId: 'OPT-NV3NHD3', // Bring back when we have an experiment to run
  identityApiPrefix: 'http://localhost:30050/v1',
  maximumDonationAmount: 25_000,
  metaPixelId: '971382557569125',
  minimumCreditAmount: 500,
  maximumCreditAmount: 500_000,
  postcodeLookupKey: 'gq9-k9zYakORdv2uoY_yVw33182',
  postcodeLookupUri: 'https://api.getAddress.io', // Full API base URI exc. trailing slash; undefined to switch off lookups.
  psps: {
    stripe: {
      enabled: true,
      prbEnabled: false, // Payment Request Buttons – Apple & Google Pay. Unsupported without SSL.
      publishableKey: 'pk_test_51GxbdTKkGuKkxwBNorvoPNKbbvEAwCjxfxOBd8lFZWAVkbJoXdFEDXOrbBbebAotP0vqLSntrLzs0Fvr7P7n0yjO00E3c61L5W',
    },
  },
  // https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
  recaptchaNonce: 'tgpRzQu1tQMPXlyDgt1hoRK2GKw=',
  // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
  recaptchaIdentitySiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  reservationMinutes: 30,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
