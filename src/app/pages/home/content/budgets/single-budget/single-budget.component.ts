import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, effect } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { Router, RouterModule } from '@angular/router';

import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';
import { MainModalService } from '../../../../../services/main-modal.service';

@Component({
  selector: 'app-single-budget',
  imports: [CommonModule, IconsComponent, RouterModule],
  templateUrl: './single-budget.component.html',
  styleUrl: './single-budget.component.scss',
})
export class SingleBudgetComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  public budgetSignal$ = this.dataStore.budgets;

  constructor() {
    effect(() => {
      let budgetSignal = this.budgetSignal$();
      this.ngOnInit();
    });
  }

  @Input() public budget: BudgetsObject = {
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
        budget_id: null,
        deleted_at: null,
        created_at: null,
        category: '',
        budget: {
          name: '',
        },
      },
    ],
  };

  @Input() public budgetIndex: number = -1;

  public isPopUpOpen: boolean = false;

  public maximum: string = '';
  public spent: string = '';
  public isTooMuchSpent: boolean = false;
  public remaining: string = '';
  public percentageProgress: string = '';

  ngOnInit() {
    this.maximum = `$${this.budget.maximum.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    this.spent = `$${this.budget.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    this.remaining = this.calculateRemaining();
    this.percentageProgress = this.calculatePercentageProgress();
  }

  // Calculate the percentage of the progress of the budget
  calculatePercentageProgress() {
    if (this.budget.amount <= 0) {
      return '0%';
    } else if (this.budget.amount >= this.budget.maximum) {
      return '100%';
    } else {
      return `${Math.trunc(this.budget.amount / this.budget.maximum * 100)}%`
    }
  }

  // Calculate the remaining amount
  calculateRemaining() {
    if (this.budget.maximum - this.budget.amount <= 0) {
      this.isTooMuchSpent = true;
      return '$0.00';
    } else {
      this.isTooMuchSpent = false;
      return `$${(
      this.budget.maximum - this.budget.amount
    ).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    }
  }

  // Open the modal when the user clicks on any button which opens a modal, givs the modal name as a string and the current pot object as "subModalObject" to the function as arguments
  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(
      subModal,
      subModalObject,
      this.budgetIndex
    );
    this.isPopUpOpen = false;
  }

  // Open the pop-up when the user clicks on the three dots
  public openPopUp() {
    if (this.isPopUpOpen) return;
    setTimeout(() => {
      this.isPopUpOpen = true;
      document.addEventListener('click', this.closePopUp.bind(this));
      console.log(
        'Budget with index ' + this.budgetIndex + ' is open: ' + this.isPopUpOpen
      );
    }, 20);
    return;
  }

  // Close the pop-up if the user clicks outside of the pop-up
  public closePopUp(event: MouseEvent) {
    if (!this.isPopUpOpen) return;
    let target = event.target as HTMLElement;
    if (!target) return;
    let allowedIDs = ['editPotButton', 'deletePotButton', 'potPopUp'];
    if (allowedIDs.includes(target.id)) return;
    this.isPopUpOpen = false;
    document.removeEventListener('click', this.closePopUp.bind(this));
    console.log(
      'Budget with index ' + this.budgetIndex + ' is open: ' + this.isPopUpOpen
    );
  }
}
