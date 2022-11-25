import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeTabsPage } from './home-tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomeTabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../main/main.module').then(m => m.MainPageModule)
      },
      {
        path: 'saving',
        loadChildren: () => import('../savings/savings.module').then(m => m.SavingsPageModule)
      },
      {
        path: 'loans',
        loadChildren:() => import('../loans/loans.module').then(m => m.LoansPageModule)
      },
      {
        path: 'shares',
        loadChildren: () => import('../shares/shares.module').then(m => m.SharesPageModule)
      }
    ]
  },
  {
    path:'',
    redirectTo:'tabs/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeTabsPage]
})
export class HomeTabsPageModule {}
