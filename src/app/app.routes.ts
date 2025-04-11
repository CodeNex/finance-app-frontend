import { Routes } from '@angular/router';

// Main pages components
import { LoginComponent } from '@login/login.component';
import { HomeComponent } from '@home/home.component';
import { ImprintComponent } from '@imprint/imprint.component';

// Home page components
import { OverviewComponent } from '@content/overview/overview.component';
import { TransactionsComponent } from '@content/transactions/transactions.component';
import { BudgetsComponent } from '@content/budgets/budgets.component';
import { PotsComponent } from '@content/pots/pots.component';
import { RecurringBillsComponent } from '@content/recurring-bills/recurring-bills.component';
import { SettingsComponent } from '@content/settings/settings.component';

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
