import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalanceComponent } from '@content/overview/balance/balance.component';
import { PotsSummaryComponent } from '@content/overview/pots-summary/pots-summary.component';
import { TransactionsSummaryComponent } from '@content/overview/transactions-summary/transactions-summary.component';
import { BudgetsSummaryComponent } from '@content/overview/budgets-summary/budgets-summary.component';
import { RecurringBillsSummaryComponent } from '@content/overview/recurring-bills-summary/recurring-bills-summary.component';



@Component({
  selector: 'app-overview',
  imports: [ CommonModule, BalanceComponent, PotsSummaryComponent, TransactionsSummaryComponent, BudgetsSummaryComponent, RecurringBillsSummaryComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
}

