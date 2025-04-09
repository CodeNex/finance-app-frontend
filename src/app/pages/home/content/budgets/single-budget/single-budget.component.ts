import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, effect } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { Router, RouterModule } from '@angular/router';

import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';
import { MainModalService } from '../../../../../services/main-modal.service';
import { LastSpendingComponent } from './last-spending/last-spending.component';

@Component({
  selector: 'app-single-budget',
  imports: [CommonModule, RouterModule, IconsComponent, LastSpendingComponent],
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
    time_frame: '',
    deleted_at: null,
    created_at: null,
    last_spendings: [
      {
        transaction_id: -1,
        user_id: -1,
        sender: '',
        receiver: '',
        name: '',
        amount: -1,
        recurring: null,
        recurring_id: null,
        theme: '',
        budget_id: null,
        deleted_at: null,
        created_at: null,
        execute_on: null,
        category: '',
        type: '',
      },
    ],
  };

  @Input() public budgetIndex: number = -1;

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
    this.timeRange = this.getDateRange('2weeks');
    console.log(this.timeRange);
    console.log(this.currentDate);
  }

  // ########################################
  // # logics to get the time frame of the budget
  // ########################################

  private currentDate: number = new Date().getTime();
  private timeRange: DateRange = {
    start: 0,
    end: 0,
  };
  public timeFrame: string = '';

  private getDateRange(type: string): { start: number; end: number } {
    const now = new Date();
    let start, end;

    switch (type) {
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime();
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1).getTime();
        end = new Date(now.getFullYear(), quarter * 3 + 3, 0).getTime();
        break;
      case 'half':
        const half = now.getMonth() < 6 ? 0 : 1;
        start = new Date(now.getFullYear(), half * 6, 1).getTime();
        end = new Date(now.getFullYear(), half * 6 + 6, 0).getTime();
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1).getTime();
        end = new Date(now.getFullYear(), 12, 0).getTime();
        break;
      default:
        throw new Error('Invalid Timeframe type');
    }

    return { start, end };
  }

  private getTimeFrameString(type: string): string {
    let timeFrame: string = '';
    switch (type) {
      case 'month':
        timeFrame = 'this month';
        break;
      case 'quarter':
        timeFrame = 'this quarter';
        break;
      case 'half':
        timeFrame = 'this half-year';
        break;
      case 'year':
        timeFrame = 'this year';
        break;
      default:
        throw new Error('Invalid Timeframe type');
    }
    return timeFrame;
  }

  // ########################################
  // # Calculate the percentage of the progress of the budget
  // # and the remaining amount of the budget
  // ########################################

  //calculate the current spent amount of the budget and set it to the this.budget.amount
  private calculateCurrentSpent(): number {
    return 0;
  }

  // Calculate the remaining amount
  calculateRemaining() {
    if (this.budget.maximum - this.budget.amount <= 0) {
      this.isTooMuchSpent = true;
      return '$0.00';
    } else {
      this.isTooMuchSpent = false;
      return `$${(this.budget.maximum - this.budget.amount).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`;
    }
  }

  // Calculate the percentage of the progress of the budget
  calculatePercentageProgress() {
    if (this.budget.amount <= 0) {
      return '0%';
    } else if (this.budget.amount >= this.budget.maximum) {
      return '100%';
    } else {
      return `${Math.trunc((this.budget.amount / this.budget.maximum) * 100)}%`;
    }
  }

  // ########################################
  // # logics to control opening and closing of the pop-up menu
  // # open the submodals when the user clicks on the buttons in the pop-up menu
  // ########################################

  public isPopUpOpen: boolean = false;

  // Open the pop-up when the user clicks on the three dots
  public openPopUp() {
    if (this.isPopUpOpen) return;
    setTimeout(() => {
      this.isPopUpOpen = true;
      document.addEventListener('click', this.closePopUp.bind(this));
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
  }

  // open either the edit or delete modal when the user clicks on the edit or delete button in the pop-up menu
  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(
      subModal,
      subModalObject,
      this.budgetIndex
    );
    this.isPopUpOpen = false;
  }
}
