import { Component, effect, inject, Signal } from '@angular/core';
import { IconsComponent } from '@components/icons/icons.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataStoreServiceService } from '@services/data-store-service.service';

/**
 * * * PotsSummaryComponent
 * This component is responsible for displaying the summary of pots in the application.
 * It uses the DataStoreService to get the pots data and calculates the total savings.
 * It uses the effect function to reactively update the total savings when the pots data changes.
 */
@Component({
  selector: 'app-pots-summary',
  imports: [IconsComponent, RouterModule, CommonModule],
  templateUrl: './pots-summary.component.html',
  styleUrl: './pots-summary.component.scss',
})
export class PotsSummaryComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public dataStore = inject(DataStoreServiceService);

  public potsArraySignal: Signal<PotsObject[]> = this.dataStore.pots;

  public potsSummaryEffect = effect(() => {
    this.totalSavings = this.getTotalSavedAmount(this.potsArraySignal());
  });

  public totalSavings: number = 0;
  // #endregion

  // #region Helper Functions
  getTotalSavedAmount(potsArray: PotsObject[]): number {
    let totalSavings = 0;
    for (let i = 0; i < potsArray.length; i++) {
      totalSavings += potsArray[i].total;
    }
    return Math.floor(totalSavings);
  }
  // #endregion
}
