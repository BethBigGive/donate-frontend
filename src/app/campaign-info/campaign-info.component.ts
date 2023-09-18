import { CurrencyPipe, DatePipe } from '@angular/common';
import {Component, Inject, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { allChildComponentImports } from '../../allChildComponentImports';
import { CampaignGroupsService } from '../campaign-groups.service';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { TimeLeftPipe } from '../time-left.pipe';

const openPipeToken = 'TimeLeftToOpenPipe';
const endPipeToken = 'timeLeftToEndPipe';

@Component({
  selector: 'app-campaign-info',
  standalone: true,
  templateUrl: './campaign-info.component.html',
  styleUrls: ['./campaign-info.component.scss'],
  imports: [
    ...allChildComponentImports,
    FontAwesomeModule,
  ],
  providers: [
    CurrencyPipe,
    // TimeLeftPipes are stateful, so we need to use a separate pipe for each date.
    {provide: openPipeToken, useClass: TimeLeftPipe},
    {provide: endPipeToken, useClass: TimeLeftPipe},
  ],
})
export class CampaignInfoComponent implements OnInit {
  additionalImageUris: Array<string|null> = [];
  @Input({ required: true }) campaign: Campaign;
  campaignOpen: boolean;
  campaignFinished: boolean;
  campaignRaised: string; // Formatted
  campaignTarget: string; // Formatted
  /**
   * The count of donations to the parent campaign if it shares funds, or to this
   * specific campaign otherwise.
   */
  donationCount: number;

  constructor(
    private currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    private route: ActivatedRoute,
    @Inject(openPipeToken) public timeLeftToOpenPipe: TimeLeftPipe,
    @Inject(endPipeToken) public timeLeftToEndPipe: TimeLeftPipe,
  ) {
  }

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
    this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);
    this.campaignFinished = CampaignService.isInPast(this.campaign);
    this.campaignTarget = this.currencyPipe.transform(
      this.campaign.parentUsesSharedFunds ? this.campaign.parentTarget : this.campaign.target,
      this.campaign.currencyCode,
      'symbol',
      '1.0-0',
    ) as string;
    this.campaignRaised = this.currencyPipe.transform(
      this.campaign.parentUsesSharedFunds ? this.campaign.parentAmountRaised : this.campaign.amountRaised,
      this.campaign.currencyCode,
      'symbol',
      '1.0-0',
    ) as string;
    this.donationCount = this.campaign.parentUsesSharedFunds
      ? (this.campaign.parentDonationCount || 0)
      : this.campaign.donationCount;
  }

  getPercentageRaised(campaign: Campaign): number | undefined {
    return CampaignService.percentRaised(campaign);
  }

  getBeneficiaryIcon(beneficiary: string) {
    return CampaignGroupsService.getBeneficiaryIcon(beneficiary);
  }

  getCategoryIcon(category: string) {
    return CampaignGroupsService.getCategoryIcon(category);
  }
}
