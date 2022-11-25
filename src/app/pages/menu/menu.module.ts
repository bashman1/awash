import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';
import { AgentDashboardPage } from '../agent-dashboard/agent-dashboard.page';

const routes: Routes = [
  {
    path:'',
    // redirectTo:'/menu/main',
    redirectTo:'/menu/home-tabs',
    pathMatch:'full'
  },
  {
    path: '',
    component: MenuPage,
    children:[
      { path: 'main', loadChildren:    () => import('../main/main.module').then(m => m.MainPageModule) },
      { path: 'accounts', loadChildren: () => import('../accounts/accounts.module').then(m => m.AccountsPageModule) },
      { path: 'loans', loadChildren: () => import('../loans/loans.module').then(m => m.LoansPageModule) },
      { path: 'shares', loadChildren: () => import('../shares/shares.module').then(m => m.SharesPageModule) },
      { path: 'savings', loadChildren: () => import('../savings/savings.module').then(m => m.SavingsPageModule) },
      { path: 'agent', loadChildren: () => import('../agent/agent.module').then(m => m.AgentPageModule) },
      { path: 'loan-detail/:id', loadChildren: () => import('../loan-detail/loan-detail.module').then(m => m.LoanDetailPageModule) },
      { path: 'dividend', loadChildren: () => import('../dividend/dividend.module').then(m => m.DividendPageModule) },
      { path: 'edit-profile', loadChildren: () => import('../edit-profile/edit-profile.module').then(m => m.EditProfilePageModule) },
      {path:'trial',loadChildren:() => import('../trial/trial.module').then(m => m.TrialPageModule)},
      { path: 'loan-appraisal', 
      children:[
        {path:'', loadChildren: () => import('../loan-appraisal/loan-appraisal.module').then(m => m.LoanAppraisalPageModule) },
        {path:'loan-details',loadChildren:() => import('../loan-details/loan-details.module').then(m => m.LoanDetailsPageModule)},
        {path: 'family-earning',loadChildren: () => import('../family-earning/family-earning.module').then( m => m.FamilyEarningPageModule)},
        {path: 'family-expenses',loadChildren: () => import('../family-expenses/family-expenses.module').then( m => m.FamilyExpensesPageModule)},
        {path: 'stock-valuation',loadChildren: () => import('../stock-valuation/stock-valuation.module').then( m => m.StockValuationPageModule)},
        {path: 'daily-sales-metrics',loadChildren: () => import('../daily-sales-metrics/daily-sales-metrics.module').then( m => m.DailySalesMetricsPageModule)},
        {path: 'operating-expenses',loadChildren: () => import('../operating-expenses/operating-expenses.module').then( m => m.OperatingExpensesPageModule)},
        {path: 'business-financial',loadChildren: () => import('../business-financial/business-financial.module').then( m => m.BusinessFinancialPageModule)},
        {path: 'cash-flow/:appraisalCode',loadChildren: () => import('../cash-flow/cash-flow.module').then( m => m.CashFlowPageModule)},
        { path: 'project-creation', loadChildren: () => import('../project-creation/project-creation.module').then(m => m.ProjectCreationPageModule) },
      ]
     },
      { path: 'loan-application', loadChildren: () => import('../loan-application/loan-application.module').then(m => m.LoanApplicationPageModule) },
      { path: 'loan-form', loadChildren: () => import('../loan-form/loan-form.module').then(m => m.LoanFormPageModule) },
      { path: 'loan-form/:customerId/:name/:customerNo/:customerType', loadChildren: () => import('../loan-form/loan-form.module').then(m => m.LoanFormPageModule) },
      { path: 'current-loans', loadChildren: () => import('../current-loans/current-loans.module').then(m => m.CurrentLoansPageModule) },
      { path: 'settled-loans', loadChildren: () => import('../settled-loans/settled-loans.module').then(m => m.SettledLoansPageModule) },
      { path: 'agent-dashboard', loadChildren: () => import('../agent-dashboard/agent-dashboard.module').then(m => m.AgentDashboardPageModule) },
      { path: 'search', loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule) },
      { path: 'payments', loadChildren: () => import('../payments/payments.module').then(m => m.PaymentsPageModule) },
      { path: 'create-customer', loadChildren: () => import('../create-customer/create-customer.module').then(m => m.CreateCustomerPageModule) },
      { path: 'customer-details', loadChildren: () => import('../customer-details/customer-details.module').then(m => m.CustomerDetailsPageModule) },
      { path: 'merchants', loadChildren: () => import('../merchants/merchants.module').then(m => m.MerchantsPageModule) },
      { path: 'merchant-history', loadChildren: () => import('../merchant-history/merchant-history.module').then(m => m.MerchantHistoryPageModule) },
      { path: 'merchant-services', loadChildren: () => import('../merchant-services/merchant-services.module').then(m => m.MerchantServicesPageModule) },
      { path: 'make-payment', loadChildren: () => import('../make-payment/make-payment.module').then(m => m.MakePaymentPageModule) },

      { path: 'what-if-analysis', loadChildren: () => import('../what-if-analysis/what-if-analysis.module').then(m => m.WhatIfAnalysisPageModule) },
      { path: 'home-tabs', loadChildren: () => import('../home-tabs/home-tabs.module').then(m => m.HomeTabsPageModule) },
      {
        path: 'merchant-extra-dependant/:paymentRef',
        loadChildren: () => import('../merchant-extra-dependant/merchant-extra-dependant.module').then( m => m.MerchantExtraDependantPageModule)
      },
      {path: 'loan-ui', loadChildren: () => import('../loan-ui/loan-ui-routing.module').then( m => m.LoanUiPageRoutingModule)}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers:[AgentDashboardPage],
  declarations: [MenuPage]
})
export class MenuPageModule {}
