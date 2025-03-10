import { Component, inject } from '@angular/core';

import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';
import { CommonModule } from '@angular/common';
import { SpendingSummaryItemComponent } from './spending-summary-item/spending-summary-item.component';

@Component({
  selector: 'app-spending-summary',
  imports: [CommonModule, SpendingSummaryItemComponent],
  templateUrl: './spending-summary.component.html',
  styleUrl: './spending-summary.component.scss',
})
export class SpendingSummaryComponent {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  public budgetsArray = this.dataStore.budgets();
}
