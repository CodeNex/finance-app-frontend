import {
  Component,
  inject,
  WritableSignal,
  computed,
  effect,
} from '@angular/core';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';
import { transition } from '@angular/animations';

@Component({
  selector: 'app-balance',
  imports: [],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
})
export class BalanceComponent {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

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

  public isDropdownOpen: boolean = false;

  public openCloseDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  public timeFrames: { [key: string]: { name: string; value: number | null } } =
    {
      '30days': { name: '30 Days', value: 30 },
      '90days': { name: '90 Days', value: 90 },
      halfYear: { name: '6 Months', value: 182 },
      all: { name: 'All', value: null },
    };

  public selectedTimeFrame: { name: string; value: number | null } =
    this.timeFrames['30days'];

  public selectTimeFrame(type: string) {
    this.selectedTimeFrame = this.timeFrames[type];
    this.getTimeBasedIncomeAndExpenses(this.selectedTimeFrame.value);
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
