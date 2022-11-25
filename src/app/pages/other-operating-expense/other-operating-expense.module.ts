import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtherOperatingExpensePageRoutingModule } from './other-operating-expense-routing.module';

import { OtherOperatingExpensePage } from './other-operating-expense.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OtherOperatingExpensePageRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [OtherOperatingExpensePage]
})
export class OtherOperatingExpensePageModule {}
