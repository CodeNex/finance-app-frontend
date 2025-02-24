import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';
import { MainModalService } from '../../../../../services/main-modal.service';
import "../../../../../shared/interfaces.ts";


@Component({
  selector: 'app-single-pot',
  imports: [CommonModule],
  templateUrl: './single-pot.component.html',
  styleUrl: './single-pot.component.scss'
})
export class SinglePotComponent {

  public mainModalService: MainModalService = inject(MainModalService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  @Input() public pot: PotsObject = {
    id: -1,
    name: "",
    target: -1,
    total: -1,
    theme: "",
    createdAt: null,
    deletedAt: null
  }
    
  @Input() public potIndex: number = -1;

  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject);
  }

}
