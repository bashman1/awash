import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyEarningPageRoutingModule } from './family-earning-routing.module';
import * as $ from 'jquery';
import { FamilyEarningPage } from './family-earning.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyEarningPageRoutingModule
  ],
  declarations: [FamilyEarningPage]
})
export class FamilyEarningPageModule {}
