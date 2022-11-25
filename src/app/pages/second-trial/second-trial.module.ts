import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SecondTrialPage } from './second-trial.page';

const routes: Routes = [
  {
    path: '',
    component: SecondTrialPage,
    // children:[
    //   // {path:'trial',loadChildren:'../trial/trial.module#TrialPageModule'}
    // ]
  },

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SecondTrialPage]
})
export class SecondTrialPageModule {}
