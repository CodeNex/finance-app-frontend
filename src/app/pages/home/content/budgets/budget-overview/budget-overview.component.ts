import { Component } from '@angular/core';
import { BudgetChartComponent } from './budget-chart/budget-chart.component';


@Component({
  selector: 'app-budget-overview',
  imports: [BudgetChartComponent],
  templateUrl: './budget-overview.component.html',
  styleUrl: './budget-overview.component.scss'
})
export class BudgetOverviewComponent {
 
}
