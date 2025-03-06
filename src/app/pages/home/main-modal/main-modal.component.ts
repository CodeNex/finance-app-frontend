import { Component, inject } from '@angular/core';

import { MainModalService } from '../../../services/main-modal.service';
import { Subscription } from 'rxjs';

import '../../../shared/interfaces.ts';

import { AddBudgetModalComponent } from '../content/budgets/budgets-modals/add-budget-modal/add-budget-modal.component';
import { DeleteBudgetModalComponent } from '../content/budgets/budgets-modals/delete-budget-modal/delete-budget-modal.component';
import { EditBudgetModalComponent } from '../content/budgets/budgets-modals/edit-budget-modal/edit-budget-modal.component';
import { AddPotModalComponent } from '../content/pots/pots-modals/add-pot-modal/add-pot-modal.component';
import { EditPotModalComponent } from '../content/pots/pots-modals/edit-pot-modal/edit-pot-modal.component';
import { DeletePotModalComponent } from '../content/pots/pots-modals/delete-pot-modal/delete-pot-modal.component';
import { AddmoneyPotModalComponent } from '../content/pots/pots-modals/addmoney-pot-modal/addmoney-pot-modal.component';
import { WithdrawmoneyPotModalComponent } from '../content/pots/pots-modals/withdrawmoney-pot-modal/withdrawmoney-pot-modal.component';

@Component({
  selector: 'app-main-modal',
  imports: [
    AddBudgetModalComponent,
    DeleteBudgetModalComponent,
    EditBudgetModalComponent,
    AddPotModalComponent,
    EditPotModalComponent,
    DeletePotModalComponent,
    AddmoneyPotModalComponent,
    WithdrawmoneyPotModalComponent,
  ],
  templateUrl: './main-modal.component.html',
  styleUrl: './main-modal.component.scss',
})
export class MainModalComponent {
  private mainModalService: MainModalService = inject(MainModalService);

  public hideMainModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.mainModalService.hideMainModal();
    }
  }

  ngOnInit() {
    this.subscribeSubModal();
  }

  // subscribe to get what sub modal has to be shown, get value from main-modal.service
  public subModalSubscription!: Subscription;
  public currentShownSubModal: string = '';
  public subModalObjectSubscription!: Subscription;
  public subModalObject: Object = {};
  public indexSubscription!: Subscription;
  public index: number = -1;

  private subscribeSubModal() {
    this.subModalSubscription =
      this.mainModalService.currentSubModal$.subscribe(
        (subModal: string) => (this.currentShownSubModal = subModal)
      );
    this.subModalObjectSubscription =
      this.mainModalService.subModalObject$.subscribe(
        (subModalObject: Object) => (this.subModalObject = subModalObject)
      );
    this.indexSubscription = this.mainModalService.index$.subscribe(
      (potIndex: number) => (this.index = potIndex)
    );
  }

  // unsubscribe sub modal to avoid memory leak
  ngOnDestroy() {
    this.unsubscribeSubModal();
  }

  private unsubscribeSubModal() {
    this.subModalSubscription.unsubscribe();
  }
}
