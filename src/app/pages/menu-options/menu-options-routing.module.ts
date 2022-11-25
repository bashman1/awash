import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuOptionsPage } from './menu-options.page';

const routes: Routes = [
  {
    path: '',
    component: MenuOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuOptionsPageRoutingModule {}
