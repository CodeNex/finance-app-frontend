import { Component, effect, inject, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpendingSummaryItemComponent } from '@content/budgets/budget-overview/spending-summary/spending-summary-item/spending-summary-item.component';

import { DataStoreServiceService } from '@services/data-store-service.service';

@Component({
  selector: 'app-spending-summary',
  imports: [CommonModule, SpendingSummaryItemComponent],
  templateUrl: './spending-summary.component.html',
  styleUrl: './spending-summary.component.scss',
})
export class SpendingSummaryComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public dataStore = inject(DataStoreServiceService);

  public budgetsArraySignal$: Signal<BudgetsObject[]> = this.dataStore.budgets;
 
  public budgetsArray: BudgetsObject[] = [];

  @Input() public inWhichSection: string = '';
  // #endregion
   
  constructor() {
    effect(() => {
      let signal = this.budgetsArraySignal$();
      this.budgetsArray = this.budgetsArraySignal$().filter((element: BudgetsObject) => !element.deleted_at);
    })
  }

  ngOnInit() {
    this.budgetsArray = this.budgetsArraySignal$().filter((element: BudgetsObject) => !element.deleted_at);
  }

}
