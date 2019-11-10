import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AnalyticsService } from '../analytics.service';
import { Donation } from '../donation.model';
import { DonationService } from '../donation.service';

@Component({
  selector: 'app-donation-complete',
  templateUrl: './donation-complete.component.html',
  styleUrls: ['./donation-complete.component.scss'],
})
export class DonationCompleteComponent {
  public complete = false;
  public donation: Donation;
  public noAccess = false;
  public timedOut = false;

  private donationId: string;
  private maxTries = 5;
  private retryInterval = 2; // In seconds
  private tries = 0;

  constructor(
    private analyticsService: AnalyticsService,
    private donationService: DonationService,
    private route: ActivatedRoute,
  ) {
    route.params.pipe().subscribe(params => {
      this.donationId = params.donationId;
      this.checkDonation();
    });
  }

  /**
   * Must be public in order for re-tries to invoke it in an anonymous context.
   */
  checkDonation(): Observable<Donation> {
    this.tries++;
    const donationLocalCopy = this.donationService.getDonation(this.donationId);

    if (donationLocalCopy === undefined) {
      this.analyticsService.logError('thank_you_no_local_copy', `Donation ID ${this.donationId}`);
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    this.donationService.get(donationLocalCopy).subscribe(donation => this.setDonation(donation));
  }

  private setDonation(donation: Donation) {
    if (donation === undefined) {
      this.analyticsService.logError('thank_you_lookup_failed', `Donation ID ${this.donationId}`);
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    this.donation = donation;

    if (this.donationService.isComplete(donation)) {
      this.analyticsService.logEvent('thank_you_fully_loaded', `Donation to campaign ${donation.projectId}`);
      this.complete = true;
      return;
    }

    if (this.tries < this.maxTries) {
      // Use an anonymous function so `this` context works inside the callback.
      setTimeout(() => this.checkDonation(), this.retryInterval * 1000);
      return;
    }

    this.analyticsService.logError('thank_you_timed_out_pre_complete', `Donation to campaign ${donation.projectId}`);
    this.timedOut = true;
  }
}