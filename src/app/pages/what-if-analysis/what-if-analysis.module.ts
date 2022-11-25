import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WhatIfAnalysisPage } from './what-if-analysis.page';

const routes: Routes = [
  {
    path: '',
    component: WhatIfAnalysisPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [WhatIfAnalysisPage]
})
export class WhatIfAnalysisPageModule {}
