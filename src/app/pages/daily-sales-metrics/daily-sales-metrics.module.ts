import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailySalesMetricsPageRoutingModule } from './daily-sales-metrics-routing.module';

import { DailySalesMetricsPage } from './daily-sales-metrics.page';

import { DailyAveragesPageModule } from '../daily-averages/daily-averages.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailySalesMetricsPageRoutingModule,
    ReactiveFormsModule,
    DailyAveragesPageModule
  ],
  declarations: [DailySalesMetricsPage]
})
export class DailySalesMetricsPageModule {}
