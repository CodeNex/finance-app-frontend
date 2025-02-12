import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingScreenComponent } from '../../../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../../../components/warning-screen/warning-screen.component';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { AuthentificationService } from '../../../../services/authentification.service';
import { APIService } from '../../../../services/api.service';

@Component({
  selector: 'app-pots',
  imports: [ LoadingScreenComponent, WarningScreenComponent, CommonModule ],
  templateUrl: './pots.component.html',
  styleUrl: './pots.component.scss'
})
export class PotsComponent {

  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthentificationService = inject(AuthentificationService);

  isLoadingScreenVisible: boolean = false;
  isWarningScreenVisible: boolean = false;

}
