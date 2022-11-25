import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoanFormPage } from './loan-form.page';
import { MaterialModule } from 'src/app/modules/material.module';

const routes: Routes = [
  {
    path: '',
    component: LoanFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoanFormPage]
})
export class LoanFormPageModule {}
