import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoanUiPage } from './loan-ui.page';

const routes: Routes = [
  {
    path: '',
    component: LoanUiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanUiPageRoutingModule {}
