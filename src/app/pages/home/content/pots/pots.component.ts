import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';
import { MainModalService } from '@services/main-modal.service';
import { SinglePotComponent } from './single-pot/single-pot.component';

@Component({
  selector: 'app-pots',
  imports: [ CommonModule, SinglePotComponent ],
  templateUrl: './pots.component.html',
  styleUrl: './pots.component.scss',
})
export class PotsComponent {
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public mainModalService: MainModalService = inject(MainModalService);

  public potsArray: any = this.dataStore.pots; 

  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
}
