import {Component, OnInit} from '@angular/core';
import {PageMetaService} from '../page-meta.service';
import {DatePipe} from '@angular/common';
import {IdentityService} from "../identity.service";
import {Person} from "../person.model";
import {Router} from "@angular/router";
import {PaymentMethod} from "@stripe/stripe-js";
import {DonationService} from "../donation.service";
import {UpdateCardModalComponent} from "../update-card-modal/update-card-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {faExclamationTriangle, faInfo} from "@fortawesome/free-solid-svg-icons";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
  providers: [DatePipe]
})
export class MyAccountComponent implements OnInit {
  public person: Person;

  public paymentMethods: PaymentMethod[]|undefined = undefined;
  registerErrorDescription: string | undefined;
  registerSucessMessage: string | undefined;
  protected readonly faExclamationTriangle = faExclamationTriangle;

  constructor(
    private pageMeta: PageMetaService,
    public dialog: MatDialog,
    private identityService: IdentityService,
    private donationService: DonationService,
    private router: Router,
  ) {
    this.identityService = identityService;
  }

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give - My account',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );

    this.identityService.getLoggedInPerson().subscribe((person: Person|null) => {
      if (! person) {
        this.router.navigate(['']);
      } else {
        this.person = person;
        this.loadPaymentMethods();
      }
    });
  }

  loadPaymentMethods() {
    // not so keen on the component using the donation service and the identity service together like this
    // would rather call one service and have it do everything for us. Not sure what service would be best to put
    // this code in.
    this.donationService.getPaymentMethods(this.person.id, this.jwtAsString())
      .subscribe((response: { data: PaymentMethod[] }) => {
          this.paymentMethods = response.data;
        }
      );
  }

  logout() {
    this.identityService.clearJWT();
    window.location.href="/";
  }

  deleteMethod(method: PaymentMethod) {
    this.paymentMethods = undefined;

    this.donationService.deleteStripePaymentMethod(this.person, method, this.jwtAsString()).subscribe(
      this.loadPaymentMethods.bind(this),
      error => {
        this.loadPaymentMethods.bind(this)()
        alert(error.error.error)
      }
    )
  }

  private jwtAsString() {
    return this.identityService.getJWT() as string;
  }

  updateCard(methodId: string, card: PaymentMethod.Card, billingDetails: PaymentMethod.BillingDetails) {
    const updateCardDialog = this.dialog.open(UpdateCardModalComponent);
    updateCardDialog.componentInstance.setPaymentMethod(card, billingDetails);
    updateCardDialog.afterClosed().subscribe((data: unknown) => {
      if (data === "null") {
        return;
      }

      const formValue = updateCardDialog.componentInstance.form.value;

      const paymentMethodsBeforeUpdate = this.paymentMethods;
      this.paymentMethods = undefined;
      this.donationService.updatePaymentMethod(
        this.person,
        this.jwtAsString(),
        methodId,
        {
          expiry: this.parseExpiryDate(formValue.expiryDate),
          countryCode: (formValue.billingCountry),
          postalCode: formValue.postalCode,
        }
      ).subscribe({
        next: () => {
          this.registerSucessMessage = "Saved new details for card ending " + card.last4;
          this.registerErrorDescription = undefined;
          this.loadPaymentMethods()
        },
        error: (resp: HttpErrorResponse)  => {
          this.registerSucessMessage = undefined;
          this.registerErrorDescription = resp.error.error ?
            `Could not update card ending ${card.last4}. ${resp.error.error}` :
            ("Sorry, update failed for card ending " + card.last4)
          this.paymentMethods = paymentMethodsBeforeUpdate;
        },
    })
    })
  }

  private parseExpiryDate(expiryDate: string): {year: number, month: number} {
    const [month, year] = expiryDate.split('/')
      .map((number: string) => parseInt(number));

    if (! year) {
      throw new Error("Failed to parse expiry date, missing year");
    }


    if (! month) {
      throw new Error("Failed to parse expiry date, missing month");
    }

    return {year, month}
  }
}
