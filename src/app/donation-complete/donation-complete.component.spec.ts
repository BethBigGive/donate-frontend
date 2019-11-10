import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AnalyticsService } from '../analytics.service';
import { DonationCompleteComponent } from './donation-complete.component';

describe('DonationCompleteComponent', () => {
  let analyticsService;
  let component: DonationCompleteComponent;
  let fixture: ComponentFixture<DonationCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationCompleteComponent ],
      imports: [
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes([
          {
            path: 'thanks/:donationId',
            component: DonationCompleteComponent,
          },
        ]),
      ],
      providers: [
        AnalyticsService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({donationId: 'myTestDonationId'}),
          },
        },
      ],
    });

    // We must mock AnalyticsService so we don't touch the window/global var which is unavailable.
    // This also lets the test assert that a specific GA method call is made.
    analyticsService = TestBed.get(AnalyticsService);
    spyOn(analyticsService, 'logError');

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // We bootstrap with a fake, unknown donation ID. So the thanks page should error out on load
    // and log that error to GA.
    expect(analyticsService.logError).toHaveBeenCalled();
  });
});