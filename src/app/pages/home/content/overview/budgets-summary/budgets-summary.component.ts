import { Component } from '@angular/core';
import { IconsComponent } from '@components/icons/icons.component';
import { RouterModule } from '@angular/router';
import { BudgetOverviewComponent } from '@content/budgets/budget-overview/budget-overview.component';

/**
 * * * * BudgetsSummaryComponent
 * This component is responsible for displaying the summary of budgets in the application.
 * It uses the DataStoreService to get the budgets data and calculates the total savings.
 * It uses the effect function to reactively update the total savings when the budgets data changes.
 */
@Component({
  selector: 'app-budgets-summary',
  imports: [IconsComponent, RouterModule, BudgetOverviewComponent],
  templateUrl: './budgets-summary.component.html',
  styleUrl: './budgets-summary.component.scss'
})
export class BudgetsSummaryComponent {
  
}
