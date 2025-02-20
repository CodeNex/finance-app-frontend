import { Component, inject } from '@angular/core';

import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MainModalService } from '../../../../../../services/main-modal.service';

@Component({
  selector: 'app-add-budget-modal',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-budget-modal.component.html',
  styleUrl: './add-budget-modal.component.scss',
})
export class AddBudgetModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
}
