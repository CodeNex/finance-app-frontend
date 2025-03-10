import { Component, inject } from '@angular/core';

import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';

@Component({
  selector: 'app-spending-summary',
  imports: [],
  templateUrl: './spending-summary.component.html',
  styleUrl: './spending-summary.component.scss'
})
export class SpendingSummaryComponent {

  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

}
