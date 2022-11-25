import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoanAppraisalPage } from './loan-appraisal.page';

const routes: Routes = [
  {
    path: '',
    component: LoanAppraisalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanAppraisalPageRoutingModule {}
