import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainModalService } from '@services/main-modal.service';
import { ApiPotsService } from '@content/pots/api-pots.service';

@Component({
  selector: 'app-delete-pot-modal',
  imports: [CommonModule],
  templateUrl: './delete-pot-modal.component.html',
  styleUrl: './delete-pot-modal.component.scss',
})
export class DeletePotModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public apiPotService = inject(ApiPotsService);

  public currentPotToDelete: string = 'CurrentPot';
  
  @Input() public modalObject: Object = {};
  @Input() public potIndex: number = -1;

  public currentPot: any = {
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    created_at: null,
    deleted_at: null,
  };

  public currentPotIndex: number = -1;
  // #endregion

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

  /**
   * * Closes the main and current modal by calling the hideMainModal method from the MainModalService.
   */
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
}
