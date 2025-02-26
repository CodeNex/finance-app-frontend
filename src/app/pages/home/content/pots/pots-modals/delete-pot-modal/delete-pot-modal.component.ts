import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { ApiPotsService } from '../../api-pots.service';

@Component({
  selector: 'app-delete-pot-modal',
  imports: [CommonModule],
  templateUrl: './delete-pot-modal.component.html',
  styleUrl: './delete-pot-modal.component.scss',
})
export class DeletePotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public apiPotService: ApiPotsService = inject(ApiPotsService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  public currentPotToDelete: string = 'CurrentPot';

  @Input() public potIndex: number = -1;
  @Input() public modalObject: Object = {};

  public currentPot: any = {
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    createdAt: null,
    deletedAt: null,
  };

  public currentPotIndex: number = -1;

  ngOnInit() {
    this.currentPot = this.modalObject;
    this.currentPotToDelete = this.currentPot.name;
    this.currentPotIndex = this.potIndex;
    console.log(this.currentPot);
    console.log(this.potIndex);
  }

  deleteCurrentPot() {
    this.apiPotService.deletePot(this.currentPot, this.currentPotIndex);
  }
}
