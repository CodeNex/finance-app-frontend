import { Component, inject } from '@angular/core';
import { LoadingScreenComponent } from '../../../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../../../components/warning-screen/warning-screen.component';
import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { APIService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budgets',
  imports: [ LoadingScreenComponent, WarningScreenComponent, CommonModule ],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent {

  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  isLoadingScreenVisible: boolean = false;
  isWarningScreenVisible: boolean = true;

}
