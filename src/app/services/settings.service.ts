import { Injectable, inject } from '@angular/core';
import { DataStoreServiceService } from './data-store-service.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public dataStore = inject(DataStoreServiceService);

  constructor() {}

  // ########################################
  // # Update Settings Signal in Data-Store-Service 
  // ########################################

  public updateSettingsSignal(settingsData: any): void {
    this.dataStore.setStoredData('settings', settingsData)
  }
}
