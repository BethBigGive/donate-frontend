import {DatePipe, PercentPipe} from '@angular/common';
import { NgModule } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {ReactiveFormsModule} from '@angular/forms';
import {RecaptchaModule} from 'ng-recaptcha';

import { allChildComponentImports } from '../../../allChildComponentImports';
import {ExactCurrencyPipe} from '../../exact-currency.pipe';
import {TimeLeftPipe} from '../../time-left.pipe';
import {CampaignDetailsModule} from "../../campaign-details/campaign-details.module";
import { DonationStartLoginComponent } from "../donation-start-login/donation-start-login.component";
import {DonationStartContainerComponent} from "../donation-start-container/donation-start-container.component";
import { DonationStartFormComponent } from "../donation-start-form/donation-start-form.component";
import { DonationStartSecondaryComponent } from '../donation-start-secondary/donation-start-secondary.component';
import { DonationStartContainerRoutingModule } from './donation-start-routing.module';
import {DonationStartFormNewComponent} from "../donation-start-form/donation-start-form-new.component";
import {DonationStartFormParentComponent} from "../donation-start-form/donation-start-form-parent.component";
import {MatExpansionModule} from '@angular/material/expansion'; 
import {MatDividerModule} from '@angular/material/divider';
@NgModule({
  imports: [
    ...allChildComponentImports,
    DonationStartContainerRoutingModule,
    ExactCurrencyPipe,
    FontAwesomeModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatExpansionModule,
    MatDividerModule,
    PercentPipe,
    ReactiveFormsModule,
    RecaptchaModule,
    TimeLeftPipe,
    CampaignDetailsModule,
  ],
  declarations: [
    DonationStartContainerComponent,
    DonationStartLoginComponent,
    DonationStartContainerComponent,
    DonationStartFormComponent,
    DonationStartFormParentComponent,
    DonationStartFormNewComponent,
    DonationStartSecondaryComponent
  ],
  providers: [
    DatePipe,
  ]
})
export class DonationStartContainerModule {}
