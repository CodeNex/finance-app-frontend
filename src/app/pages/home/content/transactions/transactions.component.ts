import { Component, inject } from '@angular/core';
import { LoadingScreenComponent } from '../../../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../../../components/warning-screen/warning-screen.component';
import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { APIService } from '../../../../services/api.service';

@Component({
  selector: 'app-transactions',
  imports: [ LoadingScreenComponent, WarningScreenComponent ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  isLoadingScreenVisible: boolean = false;
  isWarningScreenVisible: boolean = false;
  warningMessage: string = '';
}
