import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingScreenComponent } from '../../../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../../../components/warning-screen/warning-screen.component';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { AuthentificationService } from '../../../../services/authentification.service';
import { APIService } from '../../../../services/api.service';


@Component({
  selector: 'app-budgets',
  imports: [ LoadingScreenComponent, WarningScreenComponent, CommonModule ],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent {

  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthentificationService = inject(AuthentificationService);

  isLoadingScreenVisible: boolean = false;
  isWarningScreenVisible: boolean = false;

  budgetsDataLoaded: boolean = false;
  transactionsDataLoaded: boolean = false;
  isDataLoaded: boolean = false;

  checkDataLoaded() {
    if (
      this.budgetsDataLoaded &&
      this.transactionsDataLoaded
    ) {
      this.isDataLoaded = true;
    }
  }

  loadingScreenTimer() {
    setTimeout(() => {
      if (!this.isDataLoaded) {
        this.isLoadingScreenVisible = true;
      } else {
        this.isLoadingScreenVisible = false;
      }
    }, 300);
  }

  loadData(endpoint: string) {
    this.loadingScreenTimer();
    this.apiService.getData(endpoint).subscribe({
      next: (response) => {
        console.log(`${endpoint} data fetched`, response);
        switch (endpoint) {
          case 'budgets':
            this.budgetsDataLoaded = true;
            break;
          case 'transactions':
            this.transactionsDataLoaded = true;
            break;
        }
        this.checkDataLoaded();
        this.isLoadingScreenVisible = false;
        this.isWarningScreenVisible = false;
        this.apiService.warningMessage = '';
      },
      error: (error) => {
        console.error(`Fail to fetch ${endpoint} data`, error);
        this.isLoadingScreenVisible = false;
        this.apiService.warningMessage = `Fail to fetch ${endpoint} data`;
        this.isWarningScreenVisible = true;
      },
    });
  }

  ngOnInit() {
    this.loadData('transactions');
    this.loadData('budgets');
  }

}
