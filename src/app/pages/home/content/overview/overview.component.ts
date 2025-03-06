import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingScreenComponent } from '../../../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../../../components/warning-screen/warning-screen.component';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { APIService } from '../../../../services/api.service';

import { BalanceComponent } from './balance/balance.component';
import { PotsSummaryComponent } from './pots-summary/pots-summary.component';



@Component({
  selector: 'app-overview',
  imports: [LoadingScreenComponent, WarningScreenComponent, CommonModule, BalanceComponent, PotsSummaryComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);

  isLoadingScreenVisible: boolean = false;
  isWarningScreenVisible: boolean = false;
}
