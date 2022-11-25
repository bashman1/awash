import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtherFamilyExpensePageRoutingModule } from './other-family-expense-routing.module';

import { OtherFamilyExpensePage } from './other-family-expense.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtherFamilyExpensePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OtherFamilyExpensePage]
})
export class OtherFamilyExpensePageModule {}
