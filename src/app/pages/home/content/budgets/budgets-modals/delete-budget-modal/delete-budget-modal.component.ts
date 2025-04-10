import { Component, inject, Input } from '@angular/core';

import { MainModalService } from '@services/main-modal.service';
import { ApiBudgetsService } from '../../api-budgets.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-budget-modal',
  imports: [CommonModule],
  templateUrl: './delete-budget-modal.component.html',
  styleUrl: './delete-budget-modal.component.scss',
})
export class DeleteBudgetModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public apiBudgetsService: ApiBudgetsService = inject(ApiBudgetsService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  public currentBudgetToDelete: string = 'CurrentBudget';

  @Input() public modalObject: any = {};
  @Input() public budgetIndex: number = 1;

  public currentBudgetIndex: number = -1;

  ngOnInit() {
    this.currentBudgetIndex = this.budgetIndex;
    if (this.modalObject.name) {this.currentBudgetToDelete = this.modalObject.name} ;
  }

  deleteCurrentBudget() {
    this.apiBudgetsService.deleteBudget(this.modalObject, this.currentBudgetIndex);
  }
}
