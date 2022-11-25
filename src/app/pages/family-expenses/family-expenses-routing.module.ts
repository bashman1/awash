import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyExpensesPage } from './family-expenses.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyExpensesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyExpensesPageRoutingModule {}
