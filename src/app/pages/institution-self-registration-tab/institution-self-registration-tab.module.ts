import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InstitutionSelfRegistrationTabPage } from './institution-self-registration-tab.page';

const routes: Routes = [
  {
    path: '',
    component: InstitutionSelfRegistrationTabPage,
    children: [
      {
        path: 'institution-user-registration',
        children: [
          {
            path: '',
            loadChildren: () => import('../institution-user-registration/institution-user-registration.module').then(m => m.InstitutionUserRegistrationPageModule)
          }
        ]
      },
      {
        path: 'institution-self-registration',
        children: [
          {
            path: '',
            loadChildren: () => import('../institution-self-registration/institution-self-registration.module').then(m => m.InstitutionSelfRegistrationPageModule)
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
  declarations: [InstitutionSelfRegistrationTabPage]
})
export class InstitutionSelfRegistrationTabPageModule {}
