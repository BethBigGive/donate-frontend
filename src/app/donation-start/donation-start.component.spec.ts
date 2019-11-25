import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { TBG_DONATE_STORAGE } from '../donation.service';
import { DonationStartComponent } from './donation-start.component';
import { CampaignDetailsCardComponent } from '../campaign-details-card/campaign-details-card.component';
import { TimeLeftPipe } from '../time-left.pipe';

describe('DonationStartComponent', () => {
  let component: DonationStartComponent;
  let fixture: ComponentFixture<DonationStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DonationStartComponent,
        TimeLeftPipe,
        CampaignDetailsCardComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatDialogModule,
        MatExpansionModule,
        FlexLayoutModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'donate/:campaignId',
            component: DonationStartComponent,
          },
        ]),
      ],
      providers: [
        InMemoryStorageService,
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no errors with valid inputs', () => {
    component.donationForm.setValue({
      donationAmount: '£1234',
      giftAid: true,
      optInCharityEmail: false,
      optInTbgEmail: true,
    });

    expect(component.donationForm.valid).toBe(true);

    expect(component.donationForm.controls.donationAmount.errors).toBeNull();
    expect(component.donationForm.controls.giftAid.errors).toBeNull();
    expect(component.donationForm.controls.optInCharityEmail.errors).toBeNull();
    expect(component.donationForm.controls.optInTbgEmail.errors).toBeNull();
  });

  it('should have an error with required radio buttons not set', () => {
    component.donationForm.setValue({
      donationAmount: '1234',
      giftAid: null,
      optInCharityEmail: null,
      optInTbgEmail: null,
    });

    expect(component.donationForm.valid).toBe(false);

    expect(component.donationForm.controls.donationAmount.errors).toBeNull();
    expect(component.donationForm.controls.giftAid.errors.required).toBe(true);
    expect(component.donationForm.controls.optInCharityEmail.errors.required).toBe(true);
    expect(component.donationForm.controls.optInTbgEmail.errors.required).toBe(true);
  });

  it('should have missing amount error', () => {
    component.donationForm.setValue({
      donationAmount: null,
      giftAid: true,
      optInCharityEmail: true,
      optInTbgEmail: false,
    });

    expect(component.donationForm.valid).toBe(false);

    expect(Object.keys(component.donationForm.controls.donationAmount.errors)).toEqual(['required']);
    expect(component.donationForm.controls.giftAid.errors).toBeNull();
    expect(component.donationForm.controls.optInCharityEmail.errors).toBeNull();
    expect(component.donationForm.controls.optInTbgEmail.errors).toBeNull();
  });

  it('should have minimum amount error', () => {
    component.donationForm.setValue({
      donationAmount: '4',
      giftAid: false,
      optInCharityEmail: true,
      optInTbgEmail: false,
    });

    expect(component.donationForm.valid).toBe(false);

    expect(Object.keys(component.donationForm.controls.donationAmount.errors)).toEqual(['min']);
    expect(component.donationForm.controls.giftAid.errors).toBeNull();
    expect(component.donationForm.controls.optInCharityEmail.errors).toBeNull();
    expect(component.donationForm.controls.optInTbgEmail.errors).toBeNull();
  });

  it('should have maximum amount error', () => {
    component.donationForm.setValue({
      donationAmount: '25001',
      giftAid: false,
      optInCharityEmail: false,
      optInTbgEmail: false,
    });

    expect(component.donationForm.valid).toBe(false);

    expect(Object.keys(component.donationForm.controls.donationAmount.errors)).toEqual(['max']);
    expect(component.donationForm.controls.giftAid.errors).toBeNull();
    expect(component.donationForm.controls.optInCharityEmail.errors).toBeNull();
    expect(component.donationForm.controls.optInTbgEmail.errors).toBeNull();
  });

  it('should have mis-formatted amount error', () => {
    component.donationForm.setValue({
      donationAmount: '8765,21',
      giftAid: true,
      optInCharityEmail: true,
      optInTbgEmail: true,
    });

    expect(component.donationForm.valid).toBe(false);

    expect(Object.keys(component.donationForm.controls.donationAmount.errors)).toEqual(['pattern']);
    expect(component.donationForm.controls.giftAid.errors).toBeNull();
    expect(component.donationForm.controls.optInCharityEmail.errors).toBeNull();
    expect(component.donationForm.controls.optInTbgEmail.errors).toBeNull();
  });
});
