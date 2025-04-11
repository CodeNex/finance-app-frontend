import { Routes } from '@angular/router';

// Main pages components
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ImprintComponent } from './pages/imprint/imprint.component';

// Home page components
import { OverviewComponent } from './pages/home/content/overview/overview.component';
import { TransactionsComponent } from './pages/home/content/transactions/transactions.component';
import { BudgetsComponent } from './pages/home/content/budgets/budgets.component';
import { PotsComponent } from './pages/home/content/pots/pots.component';
import { RecurringBillsComponent } from './pages/home/content/recurring-bills/recurring-bills.component';
import { SettingsComponent } from './pages/home/content/settings/settings.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [

      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'budgets', component: BudgetsComponent },
      { path: 'pots', component: PotsComponent },
      { path: 'recurringBills', component: RecurringBillsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'imprint', component: ImprintComponent, data: {location: 'loggedIn'} },
    ],
  },
  { path: 'imprint', component: ImprintComponent },
  { path: '**', redirectTo: 'login' },
];
