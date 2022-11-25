import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessFinancialPage } from './business-financial.page';

const routes: Routes = [
  {
    path: '',
    component: BusinessFinancialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessFinancialPageRoutingModule {}
