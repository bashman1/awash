import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperatingExpensesPageRoutingModule } from './operating-expenses-routing.module';

import { OperatingExpensesPage } from './operating-expenses.page';
import { OtherOperatingExpensePageModule } from '../other-operating-expense/other-operating-expense.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OperatingExpensesPageRoutingModule,
    ReactiveFormsModule,
    OtherOperatingExpensePageModule
  ],
  declarations: [OperatingExpensesPage]
})
export class OperatingExpensesPageModule {}
