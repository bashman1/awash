import { searchFilter } from './../../customPipes/ng-search-pipe';
import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InstitutionSelfRegistrationPage } from './institution-self-registration.page';

const routes: Routes = [
  {
    path: '',
    component: InstitutionSelfRegistrationPage
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
  declarations: [InstitutionSelfRegistrationPage],
  providers: [searchFilter]
})
export class InstitutionSelfRegistrationPageModule {}
