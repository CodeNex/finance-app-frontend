import { Component, inject } from '@angular/core';

import { MainModalService } from '@services/main-modal.service';
import { Subscription } from 'rxjs';

import '@shared/interfaces.ts';

import { AddBudgetModalComponent } from '@content/budgets/budgets-modals/add-budget-modal/add-budget-modal.component';
import { DeleteBudgetModalComponent } from '@content/budgets/budgets-modals/delete-budget-modal/delete-budget-modal.component';
import { EditBudgetModalComponent } from '@content/budgets/budgets-modals/edit-budget-modal/edit-budget-modal.component';
import { AddPotModalComponent } from '@content/pots/pots-modals/add-pot-modal/add-pot-modal.component';
import { EditPotModalComponent } from '@content/pots/pots-modals/edit-pot-modal/edit-pot-modal.component';
import { DeletePotModalComponent } from '@content/pots/pots-modals/delete-pot-modal/delete-pot-modal.component';
import { AddmoneyPotModalComponent } from '@content/pots/pots-modals/addmoney-pot-modal/addmoney-pot-modal.component';
import { WithdrawmoneyPotModalComponent } from '@content/pots/pots-modals/withdrawmoney-pot-modal/withdrawmoney-pot-modal.component';
import { AddTransactionModalComponent } from '@content/transactions/add-transaction-modal/add-transaction-modal.component';
import { RecurringDeleteModalComponent } from '@content/recurring-bills/recurring-modals/recurring-delete-modal/recurring-delete-modal.component';

/**
 * * MainModalComponent
 * This component is responsible for displaying the main modal in the application.
 * It handles the logic for showing and hiding the modal, as well as subscribing to the main modal service to get the current sub-modal and its object.
 * It uses the MainModalService to manage the modal state and the sub-modal object.
 * It handles which sub-modal to show based on the current sub-modal value.
 * It also handles the logic for hiding the main modal when clicking outside of it.
 */
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
    AddTransactionModalComponent,
    RecurringDeleteModalComponent,
  ],
  templateUrl: './main-modal.component.html',
  styleUrl: './main-modal.component.scss',
})
export class MainModalComponent {
  private mainModalService = inject(MainModalService);

  private subscriptions = new Subscription();
  
  // #region Lifecycle Hooks
  ngOnInit() {
    this.subscribeSubModal();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  // #endregion

  // #region Subscriptions
  public currentShownSubModal: string = '';
  public subModalObject: Object = {};
  public index: number = -1;

  private subscribeSubModal() {
    this.subscriptions.add(this.mainModalService.currentSubModal$.subscribe(
      (subModal: string) => (this.currentShownSubModal = subModal)
    ));
    this.subscriptions.add(this.mainModalService.subModalObject$.subscribe(
      (subModalObject: Object) => (this.subModalObject = subModalObject)
    ));
    this.subscriptions.add(this.mainModalService.index$.subscribe(
      (potIndex: number) => (this.index = potIndex)
    ));
  }
  // #endregion

  public hideMainModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.mainModalService.hideMainModal();
    }
  }
}
