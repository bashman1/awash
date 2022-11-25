import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelfRegistrationPage } from './self-registration.page';
import { IonicSelectableModule } from 'ionic-selectable';
// import {Ng2TelInputModule} from 'ng2-tel-input';
// import { IonicTelInputModule} from 'ionic-tel-input';


const routes: Routes = [
  {
    path: '',
    component: SelfRegistrationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicSelectableModule,
    IonicModule,
    ReactiveFormsModule,
    // Ng2TelInputModule,
    // IonicTelInputModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelfRegistrationPage]
})
export class SelfRegistrationPageModule {}
