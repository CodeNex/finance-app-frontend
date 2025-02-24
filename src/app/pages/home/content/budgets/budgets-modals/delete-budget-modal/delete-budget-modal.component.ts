import { Component, inject, Input } from '@angular/core';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-budget-modal',
  imports: [CommonModule],
  templateUrl: './delete-budget-modal.component.html',
  styleUrl: './delete-budget-modal.component.scss',
})
export class DeleteBudgetModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  public currentBudgetToDelete: string = 'CurrentBudget';

  @Input() public modalObject: Object = {};
}
