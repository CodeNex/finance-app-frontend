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
    });
  }

  ngOnInit() {}

  public formattedIncome: string = '';
  public formattedExpenses: string = '';

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

  public timeFrames: { [key: string]: { name: string; value: string } } = {
    '30days': { name: '30 Days', value: '30days' },
    '90days': { name: '90 Days', value: '90days' },
    'halfYear': { name: '6 Months', value: 'halfYear' },
    'all': { name: 'All', value: 'all' },
  };

  public selectedTimeFrameValue: string = '30days';
  public selectedTimeFrameName: string = '30 Days';

  public selectTimeFrame(data: { name: string; value: string}) {
    this.selectedTimeFrameValue = data.value;
    this.selectedTimeFrameName = data.name;
  }

  public isDropdownOpen: boolean = false;

  public openCloseDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
