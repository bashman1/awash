// import { SelfRegistrationModalPageModule } from './../self-registration-modal/self-registration-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewLoginPage } from './new-login.page';

const routes: Routes = [
  {
    path: '',
    component: NewLoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    // SelfRegistrationModalPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewLoginPage]
})
export class NewLoginPageModule {}
