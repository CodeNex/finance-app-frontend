import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { APIService } from '../../../../services/api.service';
import { MainModalService } from '../../../../services/main-modal.service';

@Component({
  selector: 'app-pots',
  imports: [CommonModule],
  templateUrl: './pots.component.html',
  styleUrl: './pots.component.scss',
})
export class PotsComponent {
  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public mainModalService: MainModalService = inject(MainModalService);

  public potsArray: any = this.dataStore.pots; 

 ngOnInit() {
  // assign pots-signal from data-store-service to local potsArray
  // this.potsArray = this.dataStore.pots;
 } 

  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject);
  }
}
