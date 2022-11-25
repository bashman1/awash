import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherFamilyExpensePage } from './other-family-expense.page';

const routes: Routes = [
  {
    path: '',
    component: OtherFamilyExpensePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherFamilyExpensePageRoutingModule {}
