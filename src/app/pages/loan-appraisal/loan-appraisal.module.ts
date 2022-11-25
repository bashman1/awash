import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoanAppraisalPageRoutingModule } from './loan-appraisal-routing.module';

import { LoanAppraisalPage } from './loan-appraisal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoanAppraisalPageRoutingModule
  ],
  declarations: [LoanAppraisalPage]
})
export class LoanAppraisalPageModule {}
