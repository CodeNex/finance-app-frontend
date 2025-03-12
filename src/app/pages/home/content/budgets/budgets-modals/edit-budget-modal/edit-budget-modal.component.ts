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

  @Input() public modalObject: Object = {};
  @Input() public budgetIndex: number = 1;

  
}
