import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';

@Component({
  selector: 'app-balance',
  imports: [],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss'
})
export class BalanceComponent {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  @Input() public balance: BalanceObject = {
    id: 1,
    current: 0,
    income: 0,
    expenses: 0,
    deleted_at: null,
    created_at: null
  };

  public formattedCurrent: string = '';
  public formattedIncome: string = '';
  public formattedExpenses: string = '';

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['balance']) {
  //     this.updateBalance(this.balance);
  //   }
  // }

  ngOnInit() {
    // this.updateBalance(this.balance);
    this.formattedCurrent = this.balance.current.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
    this.formattedIncome = this.balance.income.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
    this.formattedExpenses = this.balance.expenses.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  }

  // updateBalance(balance: BalanceObject) {
  //   this.formattedCurrent = balance.current !== undefined ? balance.current.toFixed(2) : '0.00';
  //   this.formattedIncome = balance.income !== undefined ? balance.income.toFixed(2) : '0.00';
  //   this.formattedExpenses = balance.expenses !== undefined ? balance.expenses.toFixed(2) : '0.00';
  // }
}

