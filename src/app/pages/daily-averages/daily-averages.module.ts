import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyAveragesPageRoutingModule } from './daily-averages-routing.module';

import { DailyAveragesPage } from './daily-averages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyAveragesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DailyAveragesPage]
})
export class DailyAveragesPageModule {}
