import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'new-login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)},
  // { path: 'main', loadChildren: './pages/main/main.module#MainPageModule' },
  { path: 'menu', loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuPageModule) },
  { path: 'modal', loadChildren: () => import('./pages/modal/modal.module').then(m => m.ModalPageModule) },
  { path: 'login-modal', loadChildren: () => import('./pages/login-modal/login-modal.module').then(m => m.LoginModalPageModule) },
  { path: 'reset-password', loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule) },
  { path: 'new-login', loadChildren: () => import('./pages/new-login/new-login.module').then(m => m.NewLoginPageModule) },
  { path: 'self-registration', loadChildren: () => import('./pages/self-registration/self-registration.module').then(m => m.SelfRegistrationPageModule) },
  { path: 'institution-self-registration-tab', loadChildren: () => import('./pages/institution-self-registration-tab/institution-self-registration-tab.module').then(m => m.InstitutionSelfRegistrationTabPageModule) },
  { path: 'institution-profile/:id', loadChildren: () => import('./pages/institution-profile/institution-profile.module').then(m => m.InstitutionProfilePageModule) },
  { path: 'forgot-password', loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule) },
  { path: 'qr-scanner', loadChildren: () => import('./pages/qr-scanner/qr-scanner.module').then(m => m.QrScannerPageModule) },
  { path: 'modal-popover', loadChildren: () => import('./pages/modal-popover/modal-popover.module').then(m => m.ModalPopoverPageModule) },
  // {
  //   path: 'merchant-extra-dependant',
  //   loadChildren: () => import('./pages/merchant-extra-dependant/merchant-extra-dependant.module').then( m => m.MerchantExtraDependantPageModule)
  // },


  // { path: 'home-tabs', loadChildren: './pages/home-tabs/home-tabs.module#HomeTabsPageModule' },

  // { path: 'password-reset-required', loadChildren: './pages/password-reset-required/password-reset-required.module#PasswordResetRequiredPageModule' },
  // { path: 'institution-self-registration-tab', loadChildren: './pages/institution-self-registration-tab/institution-self-registration-tab.module#InstitutionSelfRegistrationTabPageModule' },


  // { path: 'institution-self-registration', loadChildren: './pages/institution-self-registration/institution-self-registration.module#InstitutionSelfRegistrationPageModule' },

  // { path: 'institution-user-registration', loadChildren: './pages/institution-user-registration/institution-user-registration.module#InstitutionUserRegistrationPageModule' },




  



  // { path: 'what-if-analysis', loadChildren: './pages/what-if-analysis/what-if-analysis.module#WhatIfAnalysisPageModule' },


  // { path: 'current-loans', loadChildren: './pages/current-loans/current-loans.module#CurrentLoansPageModule' },
  // { path: 'settled-loans', loadChildren: './pages/settled-loans/settled-loans.module#SettledLoansPageModule' },


  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
