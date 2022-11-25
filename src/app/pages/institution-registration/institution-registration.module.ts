import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InstitutionRegistrationPage } from './institution-registration.page';
import { MaterialModule } from '../../modules/material.module';
import { searchFilter } from './../../customPipes/ng-search-pipe';


const routes: Routes = [
  {
    path: '',
    component: InstitutionRegistrationPage
  }
];

// export const options: Partial<IConfig> | (() => Partial<IConfig>);


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    RouterModule.forChild(routes),
  ],
  declarations: [InstitutionRegistrationPage],
  providers: [searchFilter]
})
export class InstitutionRegistrationPageModule {}
