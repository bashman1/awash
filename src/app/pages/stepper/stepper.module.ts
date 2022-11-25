import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StepperPage } from './stepper.page';
import { MaterialModule} from '../../modules/material.module';


const routes: Routes = [
  {
    path: '',
    component: StepperPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
   MaterialModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  //   MatTableModule,
  // MatStepperModule,
  // MatButtonModule,
  // MatFormFieldModule,
  // MatInputModule,
  // MatOptionModule,
  // MatSelectModule,
  // MatIconModule,
  // MatPaginatorModule,
  // MatSortModule
  ],
  declarations: [StepperPage]
})
export class StepperPageModule {}
