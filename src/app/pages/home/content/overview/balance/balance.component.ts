import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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

  public formattedCurrent: string = '';
  public formattedIncome: string = '';
  public formattedExpenses: string = '';

  ngOnInit() {
    this.updateBalance(this.balance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['balance']) {
      this.updateBalance(this.balance);
    }
  }

  updateBalance(balance: BalanceObject) {
    this.formattedCurrent = this.getformattedValue(this.balance.balance);
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

