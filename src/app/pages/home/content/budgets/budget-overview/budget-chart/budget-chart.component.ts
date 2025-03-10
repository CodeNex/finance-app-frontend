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
    this.budgetsColors = this.getBudgetsColors();
  }

  public budgetsArray: any[] = [];
  public budgetsSpendAmount: string = '';
  public budgetsSpendAmountAsNumber: number = 0;
  public budgetsLimit: string = '';
  public budgetsLimitAsNumber: number = 0;
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
    this.budgetsSpendAmountAsNumber = Math.trunc(amount);
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
    this.budgetsLimitAsNumber = Math.trunc(limit);
    return limit.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });;
  }

  private getBudgetsPercentages() {
    let arrayCache: number[] = []; 
    this.budgetsArray.forEach((element: any) => {
      arrayCache.push(Math.trunc((element.amount / this.budgetsSpendAmountAsNumber) * 100));
    }); 
    console.log(arrayCache);
    return arrayCache;
  }

  private getBudgetsColors() {
    let arrayCache: string[] = [];
    this.budgetsArray.forEach((element: any) => {
      arrayCache.push(element.theme);
    })
    return arrayCache;
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
        data: this.budgetPercentages,
        backgroundColor: this.budgetsColors,
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
