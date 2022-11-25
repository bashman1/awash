import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InstitutionUserRegistrationPage } from './institution-user-registration.page';

const routes: Routes = [
  {
    path: '',
    component: InstitutionUserRegistrationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InstitutionUserRegistrationPage]
})
export class InstitutionUserRegistrationPageModule {}
