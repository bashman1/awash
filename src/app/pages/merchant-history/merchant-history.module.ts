import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MerchantHistoryPage } from './merchant-history.page';

const routes: Routes = [
  {
    path: '',
    component: MerchantHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MerchantHistoryPage]
})
export class MerchantHistoryPageModule {}
