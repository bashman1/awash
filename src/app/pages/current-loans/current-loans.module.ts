import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CurrentLoansPage } from './current-loans.page';
import { MaterialModule } from './../../modules/material.module';

const routes: Routes = [
  {
    path: '',
    component: CurrentLoansPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CurrentLoansPage]
})
export class CurrentLoansPageModule {}
