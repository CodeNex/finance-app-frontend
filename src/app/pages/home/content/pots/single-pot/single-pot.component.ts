import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, effect } from '@angular/core';

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

  public potSignal = this.dataStore.pots;

  constructor() {
    effect(() => {
      console.log('Pot signal changed', this.potSignal());
      
    })
  }

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

  public isPopUpOpen: boolean = false;

  public totalAmount: string = '';
  public targetAmount: string = '';
  public percentageNumber: number = 0;
  public progressBarPercentage: string = '';

  ngOnInit() {
    this.totalAmount = this.pot.total.toFixed(2);
    this.targetAmount = this.pot.target.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
    this.percentageNumber =
      Math.trunc((this.pot.total / this.pot.target) * 1000) / 10;
    this.progressBarPercentage =
      (Math.trunc((this.pot.total / this.pot.target) * 1000) / 10).toFixed(1) +
      '%';
  }

  viewTotalAmount() {
    return this.pot.total.toFixed(2);
  }

  // Open the modal when the user clicks on any button which opens a modal, givs the modal name as a string and the current pot object as "subModalObject" to the function as arguments
  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject, this.potIndex);
    this.isPopUpOpen = false;
  }

  // Open the pop-up when the user clicks on the three dots
  public openPopUp() {
    if (this.isPopUpOpen) return;
    setTimeout(() => {
      this.isPopUpOpen = true;
      document.addEventListener('click', this.closePopUp.bind(this));
      console.log(
        'Pot with index ' + this.potIndex + ' is open: ' + this.isPopUpOpen
      );
    }, 20);
    return;
  }

  // Close the pop-up if the user clicks outside of the pop-up
  public closePopUp(event: MouseEvent) {
    if (!this.isPopUpOpen) return;
    let target = event.target as HTMLElement;
    if (!target) return;
    let allowedIDs = ['editPotButton', 'deletePotButton', 'potPopUp'];
    if (allowedIDs.includes(target.id)) return;
    this.isPopUpOpen = false;
    document.removeEventListener('click', this.closePopUp.bind(this));
    console.log(
      'Pot with index ' + this.potIndex + ' is open: ' + this.isPopUpOpen
    );
  }
}
