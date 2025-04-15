import { CommonModule } from '@angular/common';
import {
  Component,
  Signal,
  signal,
  inject,
  Input,
  effect,
  Renderer2,
} from '@angular/core';
import { OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '@components/icons/icons.component';
import { LastSpendingComponent } from '@content/budgets/single-budget/last-spending/last-spending.component';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { MainModalService } from '@services/main-modal.service';
import { BudgetCalculationsService } from '@services/budget-calculations.service';

import { FormatAmountPipe } from '@shared/pipes/format-amount.pipe';

/**
 * * SingleBudgetComponent
 * This component is responsible for displaying a single budget in the application.
 * It shows the budget name, amount, and progress.
 * It also handles the logic for opening and closing the pop-up menu for editing or deleting the budget.
 * It uses the DataStoreService to manage the budget data
 * It uses the MainModalService to open modals for editing or deleting the budget.
 */
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
export class SingleBudgetComponent implements OnDestroy {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public dataStore = inject(DataStoreServiceService);
  public renderer = inject(Renderer2);
  public budgetCalculationsService = inject(BudgetCalculationsService);

  public budgetSignal: Signal<BudgetsObject[]> = this.dataStore.budgets;
  public transactionsSignal: Signal<TransactionsObject[]> =
    this.dataStore.transactions;

  public _budget = signal<BudgetsObject>({
    id: 0,
    name: '',
    amount: 0,
    maximum: 0,
    time_frame: '',
    theme: '',
    created_at: null,
    deleted_at: null,
    last_spendings: [],
  });

  @Input() set budget(value: BudgetsObject) {
    this._budget.set(value);
  }

  @Input() public budgetIndex!: number;

  private removeClickListener: (() => void) | null = null;

  public budgetCalculations: BudgetCalculations = {
    budgetName: '',
    maximum: 0,
    calculatedSpent: 0,
    remaining: 0,
    isTooMuchSpent: false,
  };

  /**
   * * Effect to calculate the budget progress and update the UI accordingly.
   * This effect will run whenever the budget or transactions change.
   */
  private budgetEffect = effect(() => {
    this.budgetSignal();
    const budget = this._budget();
    const transactions: TransactionsObject[] = this.transactionsSignal();
    if (!budget || !transactions) return;
    this.budgetCalculations = this.budgetCalculationsService.calculateBudget(
      budget,
      'year',
      transactions
    );
    this.percentageProgress = this.calculatePercentageProgress();
  });
  // #endregion

  // #region Lifecycle Hooks
  ngOnDestroy(): void {
    if (this.removeClickListener) {
      this.removeClickListener();
      this.removeClickListener = null;
    }
  }
  // #endregion

  // #region Budget Progress Bar
  public percentageProgress: string = '';

  private calculatePercentageProgress(): string {
    if (this.budgetCalculations.calculatedSpent <= 0) {
      return '0%';
    } else if (
      this.budgetCalculations.calculatedSpent >= this.budgetCalculations.maximum
    ) {
      return '100%';
    } else {
      return `${Math.trunc(
        (this.budgetCalculations.calculatedSpent /
          this.budgetCalculations.maximum) *
          100
      )}%`;
    }
  }
  // #endregion

  // #region Pop-Up & SubModal
  public isPopUpOpen: boolean = false;

  public openPopUp(): void {
    if (this.isPopUpOpen) return;
    setTimeout(() => {
      this.isPopUpOpen = true;
      this.removeClickListener = this.renderer.listen(
        'document',
        'click',
        (event: MouseEvent) => {
          this.closePopUp(event);
        }
      );
    }, 0);
  }

  public closePopUp(event: MouseEvent): void {
    if (!this.isPopUpOpen) return;
    let target = event.target as HTMLElement;
    let allowedIDs = ['editPotButton', 'deletePotButton', 'potPopUp'];
    if (allowedIDs.includes(target.id)) return;
    this.isPopUpOpen = false;

    if (this.removeClickListener) {
      this.removeClickListener();
      this.removeClickListener = null;
    }
  }

  // Opens edit/delete modal based on user action
  public openSubModal(subModal: string, currentBudget: BudgetsObject): void {
    this.mainModalService.chooseSubModal(
      subModal,
      currentBudget,
      this.budgetIndex
    );
    this.isPopUpOpen = false;
  }
  // #endregion
}
