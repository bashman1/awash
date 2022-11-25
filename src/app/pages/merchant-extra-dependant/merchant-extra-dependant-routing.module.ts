import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MerchantExtraDependantPage } from './merchant-extra-dependant.page';

const routes: Routes = [
  {
    path: '',
    component: MerchantExtraDependantPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchantExtraDependantPageRoutingModule {}
