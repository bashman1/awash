import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';


import { CashFlowPageRoutingModule } from './cash-flow-routing.module';

import { CashFlowPage } from './cash-flow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CashFlowPageRoutingModule,
    RouterTestingModule
  ],
  declarations: [CashFlowPage]
})
export class CashFlowPageModule {}
