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
  public dataStoreService: DataStoreServiceService = inject(
    DataStoreServiceService
  );

  public budgetsSignal$ = this.dataStoreService.budgets;

  private isComponentInitialized: boolean = false;

  constructor() {
    effect(() => {
      let signal = this.budgetsSignal$();
      if (this.isComponentInitialized) this.ngOnInit();
    });
  }

  ngOnInit() {
    this.budgetsArray = this.getBudgetsArray();
    this.budgetsLimit = this.getBudgetsLimit();
    this.budgetsSpendAmount = this.getBudgetsSpendAmount();
    this.budgetPercentages = this.getBudgetsPercentages();
    this.budgetsColors = this.getBudgetsColors();
    this.doughnutChartData = this.getDoughnutChartData();
    setTimeout(() => {
      this.isComponentInitialized = true;
    }, 100);
  }

  public budgetsArray: any[] = [];
  public budgetsSpendAmount: string = '';
  public budgetsSpendAmountAsNumber: number = 0;
  public budgetsLimit: string = '';
  public budgetsLimitAsNumber: number = 0;
  public budgetPercentages: number[] = [0];
  public budgetsColors: string[] = [''];
  public doughnutChartData: any = {};

  // get the budgets array from the signal
  private getBudgetsArray() {
    return this.budgetsSignal$();
  }

  // get the total amount of all budgets
  private getBudgetsSpendAmount() {
    let amount = 0;
    this.budgetsArray.forEach((element: any) => {
      amount += element.amount;
    });
    this.budgetsSpendAmountAsNumber = Math.trunc(amount);
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  // get the maximum limit over all budgets
  private getBudgetsLimit() {
    let limit = 0;
    this.budgetsArray.forEach((element: any) => {
      limit += element.maximum;
    });
    this.budgetsLimitAsNumber = Math.trunc(limit);
    return limit.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  // get the percentage of each budget and save them in an array to use them in the chart
  private getBudgetsPercentages() {
    let arrayCache: number[] = [];
    this.budgetsArray.forEach((element: any) => {
      arrayCache.push(
        Math.trunc((element.amount / this.budgetsSpendAmountAsNumber) * 100)
      );
    });
    console.log(arrayCache);
    return arrayCache;
  }

  // get the colors of the budgets and save them in an array to use them in the chart
  private getBudgetsColors() {
    let arrayCache: string[] = [];
    this.budgetsArray.forEach((element: any) => {
      arrayCache.push(element.theme);
    });
    return arrayCache;
  }

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    plugins: {
      legend: { position: 'center' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            let value = tooltipItem.raw as number;
            return ` ${value}%`;
          },
        },
      },
    },
    cutout: '68%',
  };

  // get the data for the chart
  public getDoughnutChartData() {
    return {
      datasets: [
        {
          data: this.budgetPercentages,
          backgroundColor: this.budgetsColors,
          borderWidth: 0,
        },
      ],
    };
  }

  public doughnutChartType: ChartType = 'doughnut';

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
