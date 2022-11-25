import { MaterialModule } from './../../modules/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
// import {Ng2TelInputModule} from 'ng2-tel-input';
import { IonicModule } from '@ionic/angular';
import { CustomerDetailsPage } from './customer-details.page';
import {DatePipe} from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: CustomerDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    // Ng2TelInputModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CustomerDetailsPage],
  providers:[DatePipe]
})

export class CustomerDetailsPageModule {}
