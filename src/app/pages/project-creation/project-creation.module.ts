import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectCreationPageRoutingModule } from './project-creation-routing.module';

import { ProjectCreationPage } from './project-creation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProjectCreationPageRoutingModule
  ],
  declarations: [ProjectCreationPage]
})
export class ProjectCreationPageModule {}
