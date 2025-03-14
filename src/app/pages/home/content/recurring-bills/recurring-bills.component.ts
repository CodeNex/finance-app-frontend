import { Component, inject } from '@angular/core';
import { LoadingScreenComponent } from '../../../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../../../components/warning-screen/warning-screen.component';
import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { APIService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '../../../../components/icons/icons.component';
import { AuthenticationService } from '../../../../services/authentication.service';
import { BillsSummaryComponent } from './bills-summary/bills-summary.component';

@Component({
  selector: 'app-recurring-bills',
  imports: [ LoadingScreenComponent, WarningScreenComponent, CommonModule, BillsSummaryComponent],
  templateUrl: './recurring-bills.component.html',
  styleUrl: './recurring-bills.component.scss'
})
export class RecurringBillsComponent {

  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);

  public recurringBillsArray$ = this.dataStore.transactionsRecurring();

  isLoadingScreenVisible: boolean = false;
  isWarningScreenVisible: boolean = false;
  
}
