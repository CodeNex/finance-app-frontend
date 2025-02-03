import { Component } from '@angular/core';
import { BudgetsComponent } from './budgets/budgets.component';
import { OverviewComponent } from './overview/overview.component';
import { PotsComponent } from './pots/pots.component';
import { RecurringBillsComponent } from './recurring-bills/recurring-bills.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  imports: [ RouterOutlet, BudgetsComponent, OverviewComponent, PotsComponent, RecurringBillsComponent, TransactionsComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {

}
