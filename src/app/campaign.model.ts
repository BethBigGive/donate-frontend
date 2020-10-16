export class Campaign {
  constructor(
    public id: string,
    public aims: string[],
    public amountRaised: number,
    public additionalImageUris: Array<{uri: string, order: number}>,
    public bannerUri: string,
    public budgetDetails: Array<{amount: number, description: string}>,
    public championName: string,
    public charity: {
      id: string,
      name: string,
      donateLinkId: string,
      optInStatement: string,
      facebook?: string,
      instagram?: string,
      linkedin?: string,
      logoUri?: string,
      regulatorNumber: string,
      regulatorRegion: string,
      stripeAccountId?: string,
      twitter?: string,
      website: string,
    },
    public commsMessaging: {
      charityOptIn: string,
      charityOptOut: string,
      charityOptOutMessage: string,
      tbgOptIn: string,
      tbgOptOut: string,
      tbgOptOutMessage?: string,
      championOptIn: string,
      championOptOut: string,
      championOptOutMessage: string,
    },
    public donationCount: number,
    public endDate: Date,
    public giftHandles: Array<{amount: number, description: string}>,
    public impactReporting: string,
    public impactSummary: string,
    public isMatched: boolean,
    public matchFundsRemaining: number,
    public matchFundsTotal: number,
    public problem: string,
    public promoVideoId: string,
    public quotes: Array<{person: string, quote: string}>,
    public solution: string,
    public startDate: Date,
    public status: 'Active' | 'Expired' | 'Preview',
    public summary: string = '',
    public target: number,
    public title: string,
    public updates: Array<{content: string, modifiedDate: Date}>,
    public alternativeFundUse?: string,
    public campaignCount?: number,
    public championOptInStatement?: string,
    public championRef?: string,
    public logoUri?: string,
    public parentRef?: string,
    public surplusDonationInfo?: string,
    public video?: {provider: string, key: string},
  ) {}
}
