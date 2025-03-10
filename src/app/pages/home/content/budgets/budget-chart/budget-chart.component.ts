import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-budget-chart',
  imports: [BaseChartDirective],
  templateUrl: './budget-chart.component.html',
  styleUrl: './budget-chart.component.scss'
})
export class BudgetChartComponent {

}
