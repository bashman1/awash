import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperatingExpensesPage } from './operating-expenses.page';

const routes: Routes = [
  {
    path: '',
    component: OperatingExpensesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatingExpensesPageRoutingModule {}
