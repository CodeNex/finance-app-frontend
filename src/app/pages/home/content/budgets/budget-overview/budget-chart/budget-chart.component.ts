import {
  Component,
  effect,
  inject,
  Signal,
  EffectRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartEvent, ChartOptions, ChartType } from 'chart.js';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { BudgetCalculationsService } from '@services/budget-calculations.service';
import { CommonModule } from '@angular/common';

/**
 * * BudgetChartComponent
 * This component is responsible for displaying a doughnut chart of the budgets in the application.
 * it uses the DataStoreService to manage the budget data
 * it uses the BudgetCalculationsService to calculate the budget data
 * it uses the ng2-charts library to display the chart
 * it uses the Chart.js library to display the chart
 */
@Component({
  selector: 'app-budget-chart',
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './budget-chart.component.html',
  styleUrl: './budget-chart.component.scss',
})
export class BudgetChartComponent implements OnInit, OnDestroy {
  private dataStoreService = inject(DataStoreServiceService);
  private budgetCalculationsService = inject(BudgetCalculationsService);

  private budgetsSignal: Signal<BudgetsObject[]> =
    this.dataStoreService.budgets;
  private transactionsSignal: Signal<TransactionsObject[]> =
    this.dataStoreService.transactions;

  // #region Lifecycle Hooks
  private chartEffectRef: EffectRef | null = null;

  ngOnInit(): void {
    if (this.chartEffectRef) return;
    this.chartEffectRef = effect(() => {
      this.budgetsArray = this.getBudgetsArray();
      this.budgetsLimit = this.getBudgetsLimit();
      this.updateBudgetsSpendAmount();
      this.budgetPercentages = this.getBudgetsPercentages();
      this.budgetsColors = this.getBudgetsColors();
      this.doughnutChartData = this.getDoughnutChartData();
    });
  }

  ngOnDestroy(): void {
    if (!this.chartEffectRef) return;
    this.chartEffectRef.destroy();
  }
  // #endregion

  // #region Budgets Array
  // get the budgets array from the signal and filter out deleted budgets
  public budgetsArray: BudgetsObject[] = [];

  private getBudgetsArray(): BudgetsObject[] {
    let array: BudgetsObject[] = [];
    this.budgetsSignal().forEach((element: BudgetsObject) => {
      if (!element.deleted_at) array.push(element);
    });
    return array;
  }
  // #endregion

  // #region Budgets Limit
  // get the maximum limit over all budgets
  public budgetsLimit: string = '';

  private getBudgetsLimit(): string {
    let limit = 0;
    this.budgetsArray.forEach((element: BudgetsObject) => {
      limit += element.maximum;
    });
    return limit.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  // #endregion

  // #region Spends and Percentages
  public budgetsSpendAmount: string = '';
  public budgetsSpendAmountAsNumber: number = 0;

  private updateBudgetsSpendAmount() {
    let amount = 0;
    this.budgetsArray.forEach((element: BudgetsObject) => {
      const budgetCalculations: BudgetCalculations =
        this.budgetCalculationsService.calculateBudget(
          element,
          'year',
          this.transactionsSignal()
        );

      amount += budgetCalculations.calculatedSpent;
    });
    this.budgetsSpendAmountAsNumber = amount;
    this.budgetsSpendAmount = amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  public budgetPercentages: number[] = [0];

  private getBudgetsPercentages(): number[] {
    let arrayCache: number[] = [];
    this.budgetsArray.forEach((element: BudgetsObject) => {
      const budgetCalculations: BudgetCalculations =
        this.budgetCalculationsService.calculateBudget(
          element,
          'year',
          this.transactionsSignal()
        );
      arrayCache.push(
        Math.trunc(
          (budgetCalculations.calculatedSpent /
            this.budgetsSpendAmountAsNumber) *
            100
        )
      );
    });
    return arrayCache;
  }
  // #endregion

  // #region Colors
  public budgetsColors: string[] = [''];

  private getBudgetsColors(): string[] {
    let arrayCache: string[] = [];
    this.budgetsArray.forEach((element: BudgetsObject) => {
      arrayCache.push(element.theme);
    });
    return arrayCache;
  }
  // #endregion

  // #region Chart Options & Data
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
  public doughnutChartData: any = {};

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

  public chartClicked({}: { event: ChartEvent; active: object[] }): void {}

  public chartHovered({}: { event: ChartEvent; active: object[] }): void {}
  // #endregion
}
