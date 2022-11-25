import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailySalesMetricsPage } from './daily-sales-metrics.page';

const routes: Routes = [
  {
    path: '',
    component: DailySalesMetricsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailySalesMetricsPageRoutingModule {}
