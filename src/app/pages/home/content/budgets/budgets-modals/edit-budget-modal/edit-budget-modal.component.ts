import { Component, inject } from '@angular/core';

import { MainModalService } from '../../../../../../services/main-modal.service';

@Component({
  selector: 'app-edit-budget-modal',
  imports: [],
  templateUrl: './edit-budget-modal.component.html',
  styleUrl: './edit-budget-modal.component.scss',
})
export class EditBudgetModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
}
