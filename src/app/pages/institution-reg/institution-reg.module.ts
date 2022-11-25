import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InstitutionRegPage } from './institution-reg.page';

const routes: Routes = [
  {
    path: '',
    component: InstitutionRegPage,
    children: [
      {
        path: 'institution-self-registration',
        children: [
         {
           path: '',
          loadChildren: () => import('../institution-self-registration/institution-self-registration.module').then(m => m.InstitutionSelfRegistrationPageModule)
        }
        ]
      },

      {
        path: 'institution-registration',
        children: [
          {
          path: '',
          loadChildren: () => import('../institution-registration/institution-registration.module').then(m => m.InstitutionRegistrationPageModule)
        }
      ]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InstitutionRegPage]
})
export class InstitutionRegPageModule {}
