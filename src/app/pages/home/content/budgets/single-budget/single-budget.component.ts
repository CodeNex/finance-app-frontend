import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  effect,
  runInInjectionContext,
  Injector,
} from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '@components/icons/icons.component';
import { LastSpendingComponent } from '@content/budgets/single-budget/last-spending/last-spending.component';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';
import { APIService } from '@services/api.service';
import { MainModalService } from '@services/main-modal.service';

import { FormatAmountPipe } from '@shared/pipes/format-amount.pipe';

@Component({
  selector: 'app-single-budget',
  imports: [
    CommonModule,
    RouterModule,
    IconsComponent,
    LastSpendingComponent,
    FormatAmountPipe,
  ],
  templateUrl: './single-budget.component.html',
  styleUrl: './single-budget.component.scss',
})
export class SingleBudgetComponent implements OnInit, OnDestroy {
  public mainModalService = inject(MainModalService);
  public dataStore = inject(DataStoreServiceService);
  public authService = inject(AuthenticationService);
  public apiService = inject(APIService);
  public injector = inject(Injector);

  public budgetSignal = this.dataStore.budgets;
  public transActionsSignal = this.dataStore.transactions;

  @Input() public budget!: BudgetsObject;
  @Input() public budgetIndex!: number;

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.budgetSignal();
        this.transActionsSignal();
        this.updateComponentView();
      });
    });
  }

  /**
   * Updates the view when budget or transactions change.
   */

  private updateComponentView() {
    this.calculatedSpent = this.calculateCurrentSpent(
      this.transActionsSignal(),
      this.getDateRange(this.budget.time_frame)
    );
    this.remaining = this.calculateRemaining();
    this.percentageProgress = this.calculatePercentageProgress();
  }

  /**
   * Returns the time range (start and end timestamp) based on the given budget type
   */

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

  // Calculates the current spent amount within the given time range.
  public calculatedSpent: number = 0;

  private calculateCurrentSpent(
    transactions: TransactionsObject[],
    timeRange: { start: number; end: number }
  ): number {
    let spent = 0;
    transactions.forEach((transaction: TransactionsObject) => {
      if (!transaction.execute_on) return;
      let executeDate = new Date(transaction.execute_on).getTime();
      if (
        transaction.category ===
          this.budget.name
            .replace(/\s+/g, '')
            .replace(/^./, (c) => c.toLowerCase()) &&
        executeDate >= timeRange.start &&
        executeDate <= timeRange.end
      ) {
        if (transaction.amount) spent += transaction.amount;
      }
    });
    return spent;
  }

  /**
   * Calculates budget progress and remaining funds.
   */

  // Calculate the remaining amount
  public remaining: number = 0;
  public isTooMuchSpent: boolean = false;

  private calculateRemaining() {
    if (this.budget.maximum - this.calculatedSpent <= 0) {
      this.isTooMuchSpent = true;
      return 0;
    } else {
      this.isTooMuchSpent = false;
      return this.budget.maximum - this.budget.amount;
    }
  }

  // Calculate the percentage of the progress of the budget
  public percentageProgress: string = '';

  private calculatePercentageProgress() {
    if (this.calculatedSpent <= 0) {
      return '0%';
    } else if (this.calculatedSpent >= this.budget.maximum) {
      return '100%';
    } else {
      return `${Math.trunc((this.calculatedSpent / this.budget.maximum) * 100)}%`;
    }
  }

  /**
   * Handles pop-up menu visibility and modal interactions.
   */

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

  // Opens edit/delete modal based on user action
  public openSubModal(subModal: string, currentBudget: BudgetsObject) {
    this.mainModalService.chooseSubModal(
      subModal,
      currentBudget,
      this.budgetIndex
    );
    this.isPopUpOpen = false;
  }

  /**
   * NG OnDestroy
   */

  ngOnDestroy() {
    document.removeEventListener('click', this.closePopUp.bind(this));
  }
}
