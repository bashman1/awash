import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectCreationPage } from './project-creation.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectCreationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectCreationPageRoutingModule {}
