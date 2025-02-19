import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingScreenComponent } from '../../../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../../../components/warning-screen/warning-screen.component';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../services/Authentication.service';
import { APIService } from '../../../../services/api.service';

@Component({
  selector: 'app-transactions',
  imports: [LoadingScreenComponent, WarningScreenComponent, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);

  isLoadingScreenVisible: boolean = false;
  isWarningScreenVisible: boolean = false;
}
