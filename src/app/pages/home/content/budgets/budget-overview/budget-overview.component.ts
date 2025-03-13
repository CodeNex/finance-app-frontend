import { Component, Input } from '@angular/core';
import { BudgetChartComponent } from './budget-chart/budget-chart.component';
import { SpendingSummaryComponent } from './spending-summary/spending-summary.component';


@Component({
  selector: 'app-budget-overview',
  imports: [BudgetChartComponent, SpendingSummaryComponent],
  templateUrl: './budget-overview.component.html',
  styleUrl: './budget-overview.component.scss'
})
export class BudgetOverviewComponent {
 @Input() public inWhichSection: string = '';
}
