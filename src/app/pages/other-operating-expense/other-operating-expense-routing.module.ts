import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherOperatingExpensePage } from './other-operating-expense.page';

const routes: Routes = [
  {
    path: '',
    component: OtherOperatingExpensePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherOperatingExpensePageRoutingModule {}
