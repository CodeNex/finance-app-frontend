import { Component, effect, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';

import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';

@Component({
  selector: 'app-budget-chart',
  imports: [BaseChartDirective],
  templateUrl: './budget-chart.component.html',
  styleUrl: './budget-chart.component.scss',
})
export class BudgetChartComponent {

  public dataStoreService: DataStoreServiceService = inject(DataStoreServiceService);

  public budgetsSignal$ = this.dataStoreService.budgets;

  constructor() {
    effect(() => {
      let signal = this.budgetsSignal$();
      this.ngOnInit();
    })
  }

  ngOnInit() {
    this.budgetsArray = this.getBudgetsArray();
    this.budgetsLimit = this.getBudgetsLimit();
    this.budgetsSpendAmount = this.getBudgetsSpendAmount();
    this.budgetPercentages = this.getBudgetsPercentages();
    this.getBudgetsColors();
  }

  public budgetsArray: any[] = [];
  public budgetsSpendAmount: string = '';
  public budgetsLimit: string = '';
  public budgetPercentages: number[] = [0];
  public budgetsColors: string[] = [''];

  private getBudgetsArray() {
    return this.budgetsSignal$();
  }

  private getBudgetsSpendAmount() {
    let amount = 0;
    this.budgetsArray.forEach((element: any) => {
      amount += element.amount;
    })
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });;
  }

  private getBudgetsLimit() {
    let limit = 0;
    this.budgetsArray.forEach((element: any) => {
      limit += element.maximum;
    })
    return limit.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });;
  }

  private getBudgetsPercentages() {
    let arrayCache: number[] = []; 
    this.budgetsArray.forEach((element: any) => {
      arrayCache.push(Math.trunc((element.amount / Number(this.budgetsLimit)) * 100));
    }); 
    return arrayCache;
  }

  private getBudgetsColors() {
    let arrayCache: string[] = [];
  }

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false, 
    layout: { padding: 0 },
    plugins: {
      legend: { position: 'center' },
    },
    cutout: '68%', 
  };

  public doughnutChartData: ChartData<'doughnut'> = {
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#d46c5e', '#3f82b2', '#93674F'],
        borderWidth: 0,
      },
    ],
  };

  public doughnutChartType: ChartType = "doughnut";

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
