import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';

import { MainModalService } from '@services/main-modal.service';
import { SingleBudgetComponent } from './single-budget/single-budget.component';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';


@Component({
  selector: 'app-budgets',
  imports: [CommonModule, SingleBudgetComponent, BudgetOverviewComponent],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent {
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public mainModalService: MainModalService = inject(MainModalService);

  public budgetsArray$ = this.dataStore.budgets;

  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
}
