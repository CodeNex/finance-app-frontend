import { Injectable, inject } from '@angular/core';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiTransactionService {

  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  constructor() { }
}
