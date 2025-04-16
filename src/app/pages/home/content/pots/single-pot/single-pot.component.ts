import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Input,
  effect,
  signal,
  runInInjectionContext,
  Injector,
  EffectRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { IconsComponent } from '@components/icons/icons.component';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';
import { APIService } from '@services/api.service';
import { MainModalService } from '@services/main-modal.service';
import '@shared/interfaces.ts';

/**
 * * * SinglePotComponent
 * * This component is responsible for displaying a single pot in the application.
 * * It shows the pot name, amount, and progress.
 * * It also handles the logic for opening and closing the pop-up menu for editing or deleting the pot.
 */
@Component({
  selector: 'app-single-pot',
  imports: [CommonModule, IconsComponent],
  templateUrl: './single-pot.component.html',
  styleUrl: './single-pot.component.scss',
})
export class SinglePotComponent implements OnInit, OnDestroy {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public dataStore = inject(DataStoreServiceService);
  public authService = inject(AuthenticationService);
  public apiService = inject(APIService);
  public injector = inject(Injector);

  @Input() public potIndex: number = -1;

  @Input() set potInput(value: PotsObject) {
    this.potSignal.set(value);
  }

  private potSignal = signal<PotsObject>({
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    created_at: null,
    deleted_at: null,
  });

  public pot = computed(() => this.potSignal());
  // #endregion

  // #region Lifecycle Hooks
  public potEffectRef: EffectRef | null = null;

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      this.potEffectRef = effect(() => {
        const pot: PotsObject = this.pot();
        this.initializePot(pot);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.potEffectRef) this.potEffectRef.destroy();
  }
  // #endregion

  // #region Initialize Pot
  public totalAmount: string = '';
  public targetAmount: string = '';
  public percentageNumber: number = 0;
  public progressBarPercentage: string = '';

  private initializePot(pot: PotsObject) {
    this.totalAmount = pot.total.toFixed(2);
    this.targetAmount = pot.target.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
    this.percentageNumber =
      Math.trunc((pot.total / pot.target) * 1000) / 10;
    this.progressBarPercentage =
      (Math.trunc((pot.total / pot.target) * 1000) / 10).toFixed(1) +
      '%';
  }
  // #endregion

  // #region Pop-Up & SubModal
  public isPopUpOpen: boolean = false;

  /**
   * @description - This function is responsible for opening the pop-up when the user clicks on the three dots.
   */
  public openPopUp(): void {
    if (this.isPopUpOpen) return;
    setTimeout(() => {
      this.isPopUpOpen = true;
      document.addEventListener('click', this.closePopUp.bind(this));
      console.log(
        'Pot with index ' + this.potIndex + ' is open: ' + this.isPopUpOpen
      );
    }, 20);
    return;
  }

  /**
   * @description - This function is responsible for closing the pop-up when the user clicks outside of it.
   * @param event - The mouse event that is triggered when the user clicks outside of the pop-up. 
   */
  public closePopUp(event: MouseEvent): void {
    if (!this.isPopUpOpen) return;
    let target = event.target as HTMLElement;
    if (!target) return;
    let allowedIDs = ['editPotButton', 'deletePotButton', 'potPopUp'];
    if (allowedIDs.includes(target.id)) return;
    this.isPopUpOpen = false;
    document.removeEventListener('click', this.closePopUp.bind(this));
    console.log(
      'Pot with index ' + this.potIndex + ' is open: ' + this.isPopUpOpen
    );
  }

  /**
   * @description - This function is responsible for opening the main modal in the application.
   * @param subModal - The name of the sub modal to be opened. 
   * @param subModalObject - The object that contains the data for the sub modal.  
   */
  public openSubModal(subModal: string, subModalObject: PotsObject): void {
    this.mainModalService.chooseSubModal(
      subModal,
      subModalObject,
      this.potIndex
    );
    this.isPopUpOpen = false;
  }
  // #endregion
}
