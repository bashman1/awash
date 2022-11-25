import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyAveragesPage } from './daily-averages.page';

const routes: Routes = [
  {
    path: '',
    component: DailyAveragesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyAveragesPageRoutingModule {}
