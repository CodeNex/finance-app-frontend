import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, effect } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';

import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';
import { MainModalService } from '../../../../../services/main-modal.service';

@Component({
  selector: 'app-single-budget',
  imports: [CommonModule, IconsComponent],
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

  ngOnInit() {}
}
