import { Component, inject, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';
import { MainModalService } from '@services/main-modal.service';
import { SinglePotComponent } from '@content/pots/single-pot/single-pot.component';

/**
 * * * PotsComponent
 * * This component is responsible for displaying the pots in the application.
 */
@Component({
  selector: 'app-pots',
  imports: [CommonModule, SinglePotComponent],
  templateUrl: './pots.component.html',
  styleUrl: './pots.component.scss',
})
export class PotsComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private dataStore = inject(DataStoreServiceService);
  public authService = inject(AuthenticationService);
  public mainModalService = inject(MainModalService);

  public potsSignal: Signal<PotsObject[]> = this.dataStore.pots;

  // public readonly potsArray = computed(() => this.potsSignal())();
  // #endregion

  /**
   * @description - This function is responsible for opening the main modal in the application.
   * @param subModal - The name of the sub modal to be opened.
   * @param subModalObject - The object that contains the data for the sub modal.
   */
  public openSubModal(subModal: string, subModalObject: Object): void {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
}
