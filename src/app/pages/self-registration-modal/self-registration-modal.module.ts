import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelfRegistrationModalPage } from './self-registration-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SelfRegistrationModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelfRegistrationModalPage]
})
export class SelfRegistrationModalPageModule {}
