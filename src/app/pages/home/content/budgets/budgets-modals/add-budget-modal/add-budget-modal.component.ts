import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MainModalService } from '../../../../../../services/main-modal.service';

@Component({
  selector: 'app-add-budget-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-budget-modal.component.html',
  styleUrl: './add-budget-modal.component.scss',
})
export class AddBudgetModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  @Input() public modalObject: Object = {};
}
