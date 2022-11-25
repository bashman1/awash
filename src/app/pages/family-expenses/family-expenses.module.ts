import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyExpensesPageRoutingModule } from './family-expenses-routing.module';

import { FamilyExpensesPage } from './family-expenses.page';
import { OtherFamilyExpensePageModule } from '../other-family-expense/other-family-expense.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyExpensesPageRoutingModule,
    ReactiveFormsModule,
    OtherFamilyExpensePageModule
  ],
  declarations: [FamilyExpensesPage]
})
export class FamilyExpensesPageModule {}
