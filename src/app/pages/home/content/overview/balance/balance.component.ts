import {
  Component,
  inject,
  WritableSignal,
  computed,
  effect,
} from '@angular/core';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';
import { APIService } from '@services/api.service';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '@components/icons/icons.component';

@Component({
  selector: 'app-balance',
  imports: [CommonModule, IconsComponent],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
})
export class BalanceComponent {
  public dataStore = inject(DataStoreServiceService);
  public authService = inject(AuthenticationService);
  public apiService = inject(APIService);

  public balanceSignal$: WritableSignal<BalanceObject> = this.dataStore.balance;
  public transactionsSignal$: WritableSignal<any[]> =
    this.dataStore.transactions;

  constructor() {
    effect(() => {
      let signal$ = this.transactionsSignal$();
      this.getTimeBasedIncomeAndExpenses(this.selectedTimeFrame.value);
    });
  }

  ngOnInit() {}

  // ########################################
  // # Balance Value Update and Formatting
  // ########################################

  public formattedBalance: any = computed(() => {
    return this.getformattedValue(this.balanceSignal$().balance);
  });

  getformattedValue(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // ########################################
  // # DropDown & selected Value handling
  // ########################################

  public isDropDownOpen: boolean = false;

  public openCloseDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  public timeFrames: { [key: string]: { name: string; value: number | null } } =
    {
      'week': { name: 'Week', value: 7 },
      '2weeks': { name: '2 Weeks', value: 14 },
      '30days': { name: 'Month', value: 30 },
      '60days': { name: '2 Months', value: 60 },
      '90days': { name: '3 Months', value: 90 },
      halfYear: { name: '6 Months', value: 182 },
      all: { name: 'All time', value: null },
    };

  public renderableTimesFrames: any = Object.values(this.timeFrames);

  public selectedTimeFrame: { name: string; value: number | null } =
    this.timeFrames['30days'];

  public selectTimeFrame(type: any) {
    this.selectedTimeFrame = type;
    this.getTimeBasedIncomeAndExpenses(type.value);
    this.openCloseDropdown();
  }

  // ########################################
  // # Get Timebased Income and Expenses
  // ########################################

  public formattedIncome: string = '';
  public formattedExpenses: string = '';

  public getTimeBasedIncomeAndExpenses(timeFrame: number | null = null): void {
    let currentDate = this.getCurrentDate();
    let oldestDate = this.getSubstractedDate(currentDate, timeFrame);
    let income = 0;
    let expenses = 0;

    if (timeFrame === null) {
      this.transactionsSignal$().forEach((transaction) => {
        if (transaction.type === 'debit') {
          expenses += transaction.amount;
        } else {
          income += transaction.amount;
        }
      });
    } else {
      this.transactionsSignal$().forEach((transaction) => {
        if (
          transaction.execute_on <= currentDate &&
          transaction.execute_on >= oldestDate
        ) {
          if (transaction.type === 'debit') {
            expenses += transaction.amount;
          } else {
            income += transaction.amount;
          }
        }
      });
    }

    this.formattedIncome = this.getformattedValue(income);
    this.formattedExpenses = this.getformattedValue(expenses);
  }

  // ########################################
  // # Get Current & Substracted Date
  // ########################################

  private getCurrentDate(): string {
    return new Date().toISOString();
  }

  private getSubstractedDate(currentDate: string, days: number | null): string {
    if (days === null) return currentDate;
    const date = new Date(currentDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    date.setTime(date.getTime() - days * msPerDay);
    return date.toISOString();
  }
}
