// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUriPrefix: 'https://full-biggive.cs101.force.com',
  charityCheckoutInitUri: 'https://fundraise.charitycheckouttest.co.uk/api/checkout/init',
  donateUriPrefix: 'http://localhost:4200',
  maximumDonationAmount: 25000,
  thanksUriPrefix: 'https://full-thebiggive.cs101.force.com/s/thank-you?id=',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
