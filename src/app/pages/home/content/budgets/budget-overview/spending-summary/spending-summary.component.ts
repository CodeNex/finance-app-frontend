import { Component, inject } from '@angular/core';

import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spending-summary',
  imports: [CommonModule],
  templateUrl: './spending-summary.component.html',
  styleUrl: './spending-summary.component.scss'
})
export class SpendingSummaryComponent {

  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  public budgetsArray = this.dataStore.budgets();

}
