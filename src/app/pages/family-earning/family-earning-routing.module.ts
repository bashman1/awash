import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyEarningPage } from './family-earning.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyEarningPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyEarningPageRoutingModule {}
