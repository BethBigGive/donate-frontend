export type EnvironmentID ='development'|'regression'|'staging'|'production';

// see also src/app/featureFlags.ts

export interface Environment {
  environmentId: EnvironmentID,
  production: boolean,
  productionLike: boolean,
  creditTipsCampaign: string,
  apiUriPrefix: string
  creditDonationsEnabled: boolean
  donateGlobalUriPrefix: string,

  /** Prefix for pages served by this Angular application */
  donateUriPrefix: string,

  /** Prefix for pages served by WordPress */
  blogUriPrefix: string,

  /** Prefix for pages served by the SF Experience Cloud */
  experienceUriPrefix: string
  donationsApiPrefix: string,
  getSiteControlId: string,
  googleAnalyticsId: string,
  googleOptimizeId: string | null
  identityApiPrefix: string
  maximumDonationAmount: number,
  metaPixelId: string | null, // Set null to turn off init of Meta Pixel.
  minimumCreditAmount: number,
  maximumCreditAmount: number,
  postcodeLookupKey: string,
  postcodeLookupUri: string
  psps: {
    stripe: {
      enabled: boolean,
      prbEnabled: boolean,
      publishableKey: string
    },
  },
  // https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
  recaptchaNonce: string,
  // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
  recaptchaIdentitySiteKey: string,
  reservationMinutes: number,
}
