import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InstitutionProfilePage } from './institution-profile.page';

const routes: Routes = [
  {
    path: '',
    component: InstitutionProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InstitutionProfilePage]
})
export class InstitutionProfilePageModule {}
