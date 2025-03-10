import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-budget-chart',
  imports: [BaseChartDirective],
  templateUrl: './budget-chart.component.html',
  styleUrl: './budget-chart.component.scss',
})
export class BudgetChartComponent {
  // 🛠 Korrekte Typisierung für Doughnut-Chart
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false, 
    layout: { padding: 0 },
    plugins: {
      legend: { position: 'center' },
    },
    cutout: '68%', 
  };

  // 🛠 Korrekte Typisierung für Chart-Daten
  public doughnutChartData: ChartData<'doughnut'> = {
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#d46c5e', '#3f82b2', '#93674F'],
        borderWidth: 0,
      },
    ],
  };

  // 🛠 Korrekte Typisierung für Chart-Typ
  public doughnutChartType: ChartType = "doughnut";


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
