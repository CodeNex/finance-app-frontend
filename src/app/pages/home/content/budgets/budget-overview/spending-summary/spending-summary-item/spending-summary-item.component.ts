import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  Signal,
  OnInit
} from '@angular/core';
import { FormatAmountPipe } from '@shared/pipes/format-amount.pipe';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { BudgetCalculationsService } from '@services/budget-calculations.service';

@Component({
  selector: 'app-spending-summary-item',
  imports: [CommonModule, FormatAmountPipe],
  templateUrl: './spending-summary-item.component.html',
  styleUrl: './spending-summary-item.component.scss',
})
export class SpendingSummaryItemComponent implements OnInit {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private dataStore = inject(DataStoreServiceService);
  private budgetCalculationsService = inject(BudgetCalculationsService);

  public budgetsArraySignal: Signal<BudgetsObject[]> = this.dataStore.budgets;

  @Input() public summaryItem!: BudgetsObject;

  @Input() public inWhichSection: string = '';

  public budgetCalculations: BudgetCalculations = {
    budgetName: '',
    maximum: 0,
    calculatedSpent: 0,
    remaining: 0,
    isTooMuchSpent: false,
  };
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit(): void {
    setTimeout(() => {
      this.budgetCalculations = this.budgetCalculationsService.calculateBudget(this.summaryItem, 'year');
      console.log(this.budgetCalculations);
    }, 10);
    
    
  }
  // #endregion

}
