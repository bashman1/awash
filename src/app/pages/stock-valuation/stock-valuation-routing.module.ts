import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockValuationPage } from './stock-valuation.page';

const routes: Routes = [
  {
    path: '',
    component: StockValuationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockValuationPageRoutingModule {}
