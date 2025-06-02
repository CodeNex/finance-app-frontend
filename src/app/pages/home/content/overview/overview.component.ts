import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalanceComponent } from '@content/overview/balance/balance.component';
import { PotsSummaryComponent } from '@content/overview/pots-summary/pots-summary.component';
import { TransactionsSummaryComponent } from '@content/overview/transactions-summary/transactions-summary.component';
import { BudgetsSummaryComponent } from '@content/overview/budgets-summary/budgets-summary.component';
import { RecurringBillsSummaryComponent } from '@content/overview/recurring-bills-summary/recurring-bills-summary.component';
import { AddTransactionButtonComponent } from '@src/components/add-transaction-button/add-transaction-button.component';

/**
 * * * * OverviewComponent
 * This component is responsible for displaying the overview page of the application.
 * It includes the balance, pots summary, transactions summary, budgets summary, and recurring bills summary components.
 */
@Component({
  selector: 'app-overview',
  imports: [ CommonModule, BalanceComponent, PotsSummaryComponent, TransactionsSummaryComponent, BudgetsSummaryComponent, RecurringBillsSummaryComponent, AddTransactionButtonComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
}

