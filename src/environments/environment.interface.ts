export interface Environment {
  production: boolean,
  productionLike: boolean,
  redirectHomepageToChirstmasChallenge: boolean,
  creditTipsCampaign: string,
  apiUriPrefix: string
  creditDonationsEnabled: boolean
  donateGlobalUriPrefix: string,
  donateUriPrefix: string,
  donationsApiPrefix: string,
  getSiteControlId: string,
  googleAnalyticsId: string,
  googleOptimizeId: string | null
  // googleOptimizeId: 'OPT-NV3NHD3', // Bring back when we have an experiment to run
  identityApiPrefix: string
  identityEnabled: boolean,
  maximumDonationAmount: number,
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
  recaptchaSiteKey: string,
  recaptchaIdentitySiteKey: string,
  reservationMinutes: number,
}
