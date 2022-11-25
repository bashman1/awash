import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuOptionsPageRoutingModule } from './menu-options-routing.module';

import { MenuOptionsPage } from './menu-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuOptionsPageRoutingModule
  ],
  declarations: [MenuOptionsPage]
})
export class MenuOptionsPageModule {}
