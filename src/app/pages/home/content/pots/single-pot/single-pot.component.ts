import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { IconsComponent } from '../../../../../components/icons/icons.component';

import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';
import { MainModalService } from '../../../../../services/main-modal.service';
import '../../../../../shared/interfaces.ts';

@Component({
  selector: 'app-single-pot',
  imports: [CommonModule, IconsComponent],
  templateUrl: './single-pot.component.html',
  styleUrl: './single-pot.component.scss',
})
export class SinglePotComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  @Input() public pot: PotsObject = {
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    createdAt: null,
    deletedAt: null,
  };

  @Input() public potIndex: number = -1;

  public totalAmount: string = "";
  public targetAmount: string = "";
  public percentage: number = 0;

  ngOnInit() {
    this.totalAmount = this.pot.total.toFixed(2);
    this.targetAmount = this.pot.target.toLocaleString('en-US', {maximumFractionDigits: 0});
    // this.percentage = (this.totalAmount / this.targetAmount) * 100;
  }

  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject);
  }
}
