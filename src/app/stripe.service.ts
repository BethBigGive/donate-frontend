import { Injectable } from '@angular/core';
import {
  CanMakePaymentResult,
  loadStripe,
  PaymentIntentResult,
  PaymentMethod,
  PaymentRequestPaymentMethodEvent,
  PaymentMethodCreateParams,
  PaymentRequest,
  PaymentRequestItem,
  Stripe,
  StripeCardElement,
  StripeElements,
  StripeError,
  StripePaymentRequestButtonElement,
} from '@stripe/stripe-js';
import { Observer } from 'rxjs';

import { AnalyticsService } from './analytics.service';
import { environment } from '../environments/environment';
import { Donation } from './donation.model';
import { DonationService } from './donation.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private didInit = false;
  private elements: StripeElements;
  private lastCardBrand?: string;
  private lastCardCountry?: string;
  private paymentRequest: PaymentRequest;
  private stripe: Stripe | null;
  private paymentMethodIds: Map<string, string>; // Donation ID to payment method ID.

  constructor(
    private analyticsService: AnalyticsService,
    private donationService: DonationService,
  ) {}

  async init() {
    if (this.didInit) {
      return;
    }

    this.didInit = true;

    this.paymentMethodIds = new Map();

    // Initialising through the ES Module like this is not required, but is made available by
    // an official Stripe-maintained package and gives us TypeScript types for
    // the library's objects, which allows for better IDE hinting and more
    // checks that we are handling Stripe objects as intended.
    // See https://github.com/stripe/stripe-js
    this.stripe = await loadStripe(environment.psps.stripe.publishableKey);
    if (this.stripe) {
      this.elements = this.stripe.elements({fonts: [
        {
          family: 'Maven Pro',
          src: `url('${environment.donateUriPrefix}/d/fonts/maven-pro-latin-400.woff2') format('woff2'))`,
          weight: '400',
        },
      ]});
    }
  }

  async createPaymentMethod(
    cardElement: StripeCardElement,
    donorName?: string,
  ): Promise<{paymentMethod?: PaymentMethod; error?: StripeError}> {
    if (!this.stripe) {
      console.log('Stripe not ready');
      return {};
    }

    // See https://stripe.com/docs/js/payment_methods
    const result = await this.stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: donorName,
      },
    });
    return result;
  }

  setLastCardMetadata(cardBrand?: string, cardCountry?: string) {
    this.lastCardBrand = cardBrand;
    this.lastCardCountry = cardCountry;
  }

  async confirmPayment(
    donationPreUpdate: Donation,
    cardElement: StripeCardElement,
  ): Promise<PaymentIntentResult | undefined> {
    if (!this.stripe || !donationPreUpdate.clientSecret || !donationPreUpdate.donationId) {
      console.log('Stripe not ready for confirmPayment()');
      return;
    }

    let paymentMethod: any;
    let isPrb = false;

    const billingDetails: PaymentMethodCreateParams.BillingDetails = {
      email: donationPreUpdate.emailAddress,
      name: `${donationPreUpdate.firstName} ${donationPreUpdate.lastName}` ?? undefined,
    };

    billingDetails.address = {
      country: donationPreUpdate.countryCode,
      postal_code: donationPreUpdate.billingPostalAddress, // Just postcode in the Stripe case.
    };

    // Ensure fee info is updated before finalising payment.
    return new Promise<PaymentIntentResult>((resolve, reject) => {
      this.donationService.updatePaymentDetails(donationPreUpdate, this.lastCardBrand, this.lastCardCountry)
      .subscribe(donation => {
        if (!donation.clientSecret || !donation.donationId) {
          reject('Missing ID in card-details-updated donation');
          return;
        }

        // Processing adapted from
        // https://stripe.com/docs/stripe-js/elements/payment-request-button?html-or-react=html#html-js-complete-payment
        // and card version merged with PRB one. More detailed comments on params
        // rationale there.
        if (this.paymentMethodIds.has(donation.donationId)) {
          isPrb = true;
          paymentMethod = this.paymentMethodIds.get(donation.donationId);
        } else {
          paymentMethod = {
            card: cardElement,
            // See https://stripe.com/docs/payments/accept-a-payment#web-submit-payment
            billing_details: billingDetails,
          };
        }

        this.stripe?.confirmCardPayment(
          donation.clientSecret,
          { payment_method: paymentMethod },
          { handleActions: !isPrb },
        ).then(async confirmResult => {
          const analyticsEventActionPrefix = isPrb ? 'stripe_prb_' : 'stripe_card_';

          if (confirmResult.error) {
            // Failure w/ no extra action applicable
            this.analyticsService.logError(
              `${analyticsEventActionPrefix}payment_error`,
              confirmResult.error.message ?? '[No message]',
            );

            resolve(confirmResult);
            return;
          }

          if (confirmResult.paymentIntent.status !== 'requires_action') {
            // Success w/ no extra action needed
            this.analyticsService.logEvent(
              `${analyticsEventActionPrefix}payment_success`,
              `Stripe Intent processing or done for donation ${donation.donationId} to campaign ${donation.projectId}`,
            );

            resolve(confirmResult);
            return;
          }

          // The PaymentIntent requires an action e.g. 3DS verification; let Stripe.js handle the flow.
          this.analyticsService.logEvent(`${analyticsEventActionPrefix}requires_action`, confirmResult.paymentIntent.next_action?.type ?? '[Action unknown]');
          this.stripe?.confirmCardPayment(donation.clientSecret || '').then(confirmAgainResult => {
            if (confirmAgainResult.error) {
              this.analyticsService.logError(`${analyticsEventActionPrefix}further_action_error`, confirmAgainResult.error.message ?? '[No message]');
            }

            // Extra action done, whether successfully or not.
            resolve(confirmAgainResult);
          });
        });
      });
    });
  }

  getCard(): StripeCardElement | null {
    if (!this.elements) {
      console.log('Stripe Elements not ready');
      return null;
    }

    const existingElement = this.elements.getElement('card');
    if (existingElement) {
      return existingElement;
    }

    return this.elements.create('card', {
      // In order to make things quicker when home & billing postcodes are the same,
      // we always collect this outside the form (defaulting to home value where appropriate)
      // so can always hide it from the Stripe form. We pass in the value we collected in
      // `confirmCardPayment()` instead.
      hidePostalCode: true,
      iconStyle: 'solid',
      style: {
        base: {
          fontFamily: 'Maven Pro, sans-serif',
          fontSize: '14px',
        },
      },
    });
  }

  getPaymentRequestButton(
    donation: Donation,
    resultObserver: Observer<PaymentMethod.BillingDetails | undefined>,
  ): StripePaymentRequestButtonElement | null {
    if (!this.elements || !this.stripe) {
      console.log('Stripe Elements not ready');
      return null;
    }

    if (this.paymentRequest) {
      this.paymentRequest.update({
        currency: donation.currencyCode.toLowerCase() || 'gbp',
        total: this.getPaymentRequestButtonTotal(donation),
        displayItems: this.getPaymentRequestButtonDisplayItems(donation),
      });
    } else {
      this.paymentRequest = this.stripe.paymentRequest({
        country: donation.countryCode || 'GB',
        currency: donation.currencyCode.toLowerCase() || 'gbp',
        total: this.getPaymentRequestButtonTotal(donation),
        displayItems: this.getPaymentRequestButtonDisplayItems(donation),
        requestPayerName: true,
        requestPayerEmail: true,
      });
    }

    // Always re-define the `on()` so that `resultObserver` is using the latest observer,
    // in the event that we re-created the PRB, and not trying to call back to a stale
    // element.
    this.paymentRequest.on('paymentmethod', (event: PaymentRequestPaymentMethodEvent) => {
      // Update fee details before confirming payment
      this.setLastCardMetadata(
        event.paymentMethod?.card?.brand,
        event.paymentMethod?.card?.country || 'N/A',
      );

      if (!donation.donationId) {
        event.complete('fail');
        console.log('No donation client secret to complete PaymentRequest');
        return;
      }

      this.paymentMethodIds.set(donation.donationId, event.paymentMethod.id);

      event.complete('success');
      resultObserver.next(event.paymentMethod?.billing_details); // Let the page hide the card details & make 'Next' available.
    });

    const existingElement = this.elements.getElement('paymentRequestButton');
    if (existingElement) {
      return existingElement;
    }

    return this.elements.create('paymentRequestButton', {
      paymentRequest: this.paymentRequest,
      style: {
        paymentRequestButton: {
          type: 'donate',
        },
      },
    });
  }

  canUsePaymentRequest(): Promise<CanMakePaymentResult|null> {
    return this.paymentRequest.canMakePayment();
  }

  private getPaymentRequestButtonTotal(donation: Donation): PaymentRequestItem {
    let label = `Donation to ${donation.charityName}`;

    if (donation.tipAmount > 0) {
      label = `${label} and the Big Give`;
    }

    if (donation.feeCoverAmount > 0) {
      label = `${label} and fee cover`;
    }

    return {
      label,
      // In pence/cents, inc. tip
      amount:
        (100 * donation.donationAmount) +
        (100 * donation.tipAmount) +
        (100 * donation.feeCoverAmount),
    };
  }

  private getPaymentRequestButtonDisplayItems(donation: Donation): PaymentRequestItem[] | undefined {
    if (!donation.tipAmount && !donation.feeCoverAmount) {
      return undefined;
    }

    const items = [
      {
        amount: 100 * donation.donationAmount,
        label: `Donation to ${donation.charityName}`,
      },
    ];

    if (donation.tipAmount > 0) {
      items.push({
        amount: 100 * donation.tipAmount,
        label: 'Donation to the Big Give',
      });
    }

    if (donation.feeCoverAmount > 0) {
      items.push({
        amount: 100 * donation.feeCoverAmount,
        label: 'Fee cover',
      });
    }

    return items;
  }
}
