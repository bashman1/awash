import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MerchantExtraDependantPageRoutingModule } from './merchant-extra-dependant-routing.module';

import { MerchantExtraDependantPage } from './merchant-extra-dependant.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MerchantExtraDependantPageRoutingModule
  ],
  declarations: [MerchantExtraDependantPage]
})
export class MerchantExtraDependantPageModule {}
