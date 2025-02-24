import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { BasedataService } from '../../../../../../services/basedata.service';

@Component({
  selector: 'app-add-budget-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-budget-modal.component.html',
  styleUrl: './add-budget-modal.component.scss',
})
export class AddBudgetModalComponent implements OnInit {
  public mainModalService: MainModalService = inject(MainModalService);
  private basedataService: BasedataService = inject(BasedataService);
  private formBuilder: FormBuilder = inject(FormBuilder);

  public categories: string[] = [];
  public budgetForm = this.formBuilder.group({
    category: ['', Validators.required],
  });

  @Input() public modalObject: Object = {};

  ngOnInit() {
    this.categories = Object.values(
      this.basedataService.financeApp.budgets.categories
    );
  }

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  public onSubmit() {
    if (this.budgetForm.valid) {
      console.log('Formular abgesendet:', this.budgetForm.value);
      this.closeMainModal();
    }
  }
}
