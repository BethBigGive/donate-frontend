import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatSelectModule,
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { Campaign } from '../campaign.model';
import { CampaignCardComponent } from '../campaign-card/campaign-card.component';
import { CampaignSearchFormComponent } from '../campaign-search-form/campaign-search-form.component';
import { CampaignSummary } from '../campaign-summary.model';
import { FiltersComponent } from './../filters/filters.component';
import { HeroComponent } from '../hero/hero.component';
import { MetaCampaignComponent } from './meta-campaign.component';
import { TimeLeftPipe } from '../time-left.pipe';

describe('MetaCampaignComponent', () => {
  let component: MetaCampaignComponent;
  let fixture: ComponentFixture<MetaCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampaignCardComponent,
        CampaignSearchFormComponent,
        FiltersComponent,
        HeroComponent,
        MetaCampaignComponent,
        TimeLeftPipe,
      ],
      imports: [
        HttpClientTestingModule,
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatCardModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaCampaignComponent);
    component = fixture.componentInstance;

    component.campaign = new Campaign(
      'testMasterCampaignId',
      ['Aim 1'],
      123,
      [],
      'https://example.com/banner.png',
      [],
      undefined,
      { id: 'tbgId', name: 'The Big Give' },
      4,
      new Date(),
      [],
      'Impact reporting plan',
      'Impact overview',
      true,
      987,
      'The situation',
      [],
      'The solution',
      new Date(),
      'Active',
      'Test Master Campaign detail',
      undefined,
      'Test Master Campaign!',
      [],
      null,
    );
    component.children = [
      new CampaignSummary(
        'testCampaignId',
        123,
        ['cat1', 'cat2'],
        'Test Champion',
        { id: 'testCharityId', name: 'Test Charity' },
        new Date(),
        'https://example.com/image.png',
        true,
        400,
        new Date(),
        1230,
        'Test Campaign!',
      ),
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
