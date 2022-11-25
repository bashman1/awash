import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {MatExpansionModule} from '@angular/material/expansion'; 
import { LoanDetailPage } from './loan-detail.page';
import {MatIconModule} from '@angular/material/icon'; 
const routes: Routes = [
  {
    path: '',
    component: LoanDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    IonicModule,
    MatIconModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoanDetailPage]
})
export class LoanDetailPageModule {}
