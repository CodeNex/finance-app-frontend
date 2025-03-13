import { Component, inject, Input } from '@angular/core';

import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { ApiBudgetsService } from '../../api-budgets.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-budget-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-budget-modal.component.html',
  styleUrl: './edit-budget-modal.component.scss',
})
export class EditBudgetModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public apiBudgetsService: ApiBudgetsService = inject(ApiBudgetsService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  @Input() public budgetIndex: number = 1;
  @Input() public modalObject: Object = {};

  public currentBudget: any = {
    id: -1,
    name: '',
    amount: -1,
    maximum: -1,
    theme: '',
    deleted_at: null,
    created_at: null,
    last_spendings: [
      {
        id: -1,
        user: -1,
        name: '',
        amount: -1,
        recurring: null,
        theme: '',
        budget_id: null,
        deleted_at: null,
        created_at: null,
        category: '',
        budget: {
          category: '',
        },
      },
    ],
  };

  public currentBudgetIndex: number = -1;


  ngOnInit() {
    this.currentBudget = this.modalObject;
    this.currentBudgetIndex = this.budgetIndex;

    console.log(this.currentBudget, this.currentBudgetIndex);
    
  }
}
