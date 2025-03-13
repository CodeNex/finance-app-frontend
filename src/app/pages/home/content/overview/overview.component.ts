import { Component, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingScreenComponent } from '../../../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../../../components/warning-screen/warning-screen.component';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { APIService } from '../../../../services/api.service';

import { BalanceComponent } from './balance/balance.component';
import { PotsSummaryComponent } from './pots-summary/pots-summary.component';
import { TransactionsSummaryComponent } from './transactions-summary/transactions-summary.component';
import { BudgetsSummaryComponent } from './budgets-summary/budgets-summary.component';
import { RecurringBillsSummaryComponent } from './recurring-bills-summary/recurring-bills-summary.component';



@Component({
  selector: 'app-overview',
  imports: [LoadingScreenComponent, WarningScreenComponent, CommonModule, BalanceComponent, PotsSummaryComponent, TransactionsSummaryComponent, BudgetsSummaryComponent, RecurringBillsSummaryComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit {
  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);

  isLoadingScreenVisible: boolean = false;
  isWarningScreenVisible: boolean = false;

  public balanceData: any;
  public potsData$: any;
  public transactionsData: any;
  public budgetsData: any;
  public recurringBillsData: any;

  ngOnInit() {
    this.updateData();
  }

  updateData() {
    this.balanceData = this.dataStore.balance();

    // this.potsData = this.dataStore.pots;
    
    
    this.transactionsData = this.dataStore.transactions();
    this.budgetsData = this.dataStore.budgets();
    this.recurringBillsData = this.dataStore.transactionsRecurring();
  }
}

