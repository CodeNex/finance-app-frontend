import { Component, inject } from '@angular/core';
import { LoadingScreenComponent } from '../../../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../../../components/warning-screen/warning-screen.component';
import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { APIService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  imports: [LoadingScreenComponent, WarningScreenComponent, CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {

  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  isLoadingScreenVisible: boolean = false;
  isWarningScreenVisible: boolean = false;
  
  balanceDataLoaded: any = false;
  budgetsDataLoaded: any = false;
  potsDataLoaded: any = false;
  transactionsDataLoaded: any = false;

  isDataLoaded: boolean = this.balanceDataLoaded && this.budgetsDataLoaded && this.potsDataLoaded && this.transactionsDataLoaded;

  loadBalanceData() {
    this.apiService.getData('balance').subscribe({
      next: (response) => {
        console.log('Balance data fetched', response);
        this.balanceDataLoaded = true;
        this.checkDataLoaded();
      },
      error: (error) => {
        console.error('Fail to fetch balance data', error);
        this.apiService.warningMessage = 'Fail to fetch balance data';
        this.isWarningScreenVisible = true;
      }
    })
  }

  loadBudgetsData() {
    this.apiService.getData('budgets').subscribe({
      next: (response) => {
        console.log('Budgets data fetched', response);
        this.budgetsDataLoaded = true;
        this.checkDataLoaded();
      },
      error: (error) => {
        console.error('Fail to fetch budgets data', error);
        this.apiService.warningMessage = 'Fail to fetch budgets data';
        this.isWarningScreenVisible = true;
      }
    })
  }

  loadPotsData() {
    this.apiService.getData('pots').subscribe({
      next: (response) => {
        console.log('Pots data fetched', response);
        this.potsDataLoaded = true;
        this.checkDataLoaded();
      },
      error: (error) => {
        console.error('Fail to fetch pots data', error);
        this.apiService.warningMessage = 'Fail to fetch pots data';
        this.isWarningScreenVisible = true;
      }
    })
  }

  loadTransactionsData() {
    this.apiService.getData('transactions').subscribe({
      next: (response) => {
        console.log('Transactions data fetched', response);
        this.transactionsDataLoaded = true;
        this.checkDataLoaded();
      },
      error: (error) => {
        console.error('Fail to fetch transactions data', error);
        this.apiService.warningMessage = 'Fail to fetch transactions data';
        this.isWarningScreenVisible = true;
      }
    })
  }

  checkDataLoaded() {
    if (this.balanceDataLoaded && this.budgetsDataLoaded && this.potsDataLoaded && this.transactionsDataLoaded) {
      this.isDataLoaded = true;
    }
  }


  ngOnInit() {
    this.loadBalanceData();
    this.loadBudgetsData();
    this.loadPotsData();
    this.loadTransactionsData();
  } 
}
