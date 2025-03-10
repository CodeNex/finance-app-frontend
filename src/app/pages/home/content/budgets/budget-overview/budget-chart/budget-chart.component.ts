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
  // Doughnut
 public doughnutChartLabels: string[] = [
  'Download Sales',
  'In-Store Sales',
  'Mail-Order Sales',
];
public doughnutChartData: ChartData<'doughnut'> = {
  labels: this.doughnutChartLabels,
  datasets: [
    { data: [350, 450, 100] },
    { data: [50, 150, 120] },
    { data: [250, 130, 70] },
  ],
};
public doughnutChartType: ChartType = 'doughnut';

// events
public chartClicked({
  event,
  active,
}: {
  event: ChartEvent;
  active: object[];
}): void {
  console.log(event, active);
}

public chartHovered({
  event,
  active,
}: {
  event: ChartEvent;
  active: object[];
}): void {
  console.log(event, active);
}

}
