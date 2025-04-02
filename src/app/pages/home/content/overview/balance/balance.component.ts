import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, WritableSignal, computed } from '@angular/core';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';

@Component({
  selector: 'app-balance',
  imports: [],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss'
})
export class BalanceComponent implements OnInit, OnChanges {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  @Input() public balance: BalanceObject = {
    balance: -1,
  };

  public balanceSignal$: WritableSignal<BalanceObject> = this.dataStore.balance;

  ngOnInit() {
    this.updateBalance(this.balance);
    console.log(this.formattedBalance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['balance']) {
      this.updateBalance(this.balance);
    }
    
    
  }

  // ########################################
  // # Format and Update Values in the Component 
  // # This function updates the values in the component when the balance changes.
  // ########################################

  public formattedBalance: any = computed(() => {
    return this.getformattedValue(this.balanceSignal$().balance);
  });

  public formattedIncome: string = '';
  public formattedExpenses: string = '';

  updateBalance(balance: BalanceObject) {
    // this.formattedBalance = this.getformattedValue(this.balance.balance);
    // this.formattedIncome = this.getformattedValue(this.balance.income);
    // this.formattedExpenses = this.getformattedValue(this.balance.expenses);
    
  }

  getformattedValue(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

