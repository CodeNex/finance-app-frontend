import { Component, Input } from '@angular/core';
import { BudgetChartComponent } from '@content/budgets/budget-overview/budget-chart/budget-chart.component';
import { SpendingSummaryComponent } from '@content/budgets/budget-overview/spending-summary/spending-summary.component';

/**
 * * BudgetOverviewComponent
 * This component is responsible for displaying the budget overview page.
 * It uses the BudgetChartComponent and SpendingSummaryComponent to display the data.
 */
@Component({
  selector: 'app-budget-overview',
  imports: [BudgetChartComponent, SpendingSummaryComponent],
  templateUrl: './budget-overview.component.html',
  styleUrl: './budget-overview.component.scss'
})
export class BudgetOverviewComponent {
 @Input() public inWhichSection: string = '';
}
