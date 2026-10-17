import { Routes } from '@angular/router';
import { CustomerLayout } from './features/customer/layout/customer-layout/customer-layout';

export const routes: Routes = [
  {
    path: 'customer',
    component: CustomerLayout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/customer/pages/customer-dashboard/customer-dashboard')
            .then(m => m.CustomerDashboard)
      },
      {
        path: 'emi-schedule',
        loadComponent: () =>
          import('./features/emi/pages/emi-schedule/emi-schedule')
            .then(m => m.EmiSchedule)
      },
{
  path: 'payment-history',
  loadComponent: () =>
    import('./features/payment/pages/payment-history/payment-history')
      .then(m => m.PaymentHistoryPage)
}
,
{
  path: 'my-penalty',
  loadComponent: () =>
    import('./features/payment/pages/my-penalty/my-penalty')
      .then(m => m.MyPenalty)
}
    ]
  },
  {
    path: 'officer/dashboard',
    loadComponent: () =>
      import('./features/credit-officer/pages/credit-officer-dashboard/credit-officer-dashboard')
        .then(m => m.CreditOfficerDashboard)
  },
  {
    path: '',
    redirectTo: 'customer/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'customer/dashboard'
  }
];