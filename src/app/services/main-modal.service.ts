import { Injectable, Output, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainModalService {

  constructor() { }

  // show/hide main modal
  @Output() public isMainModalVisible$ = new BehaviorSubject<boolean>(true);

  public showMainModal() {
    this.isMainModalVisible$.next(true);
  }

  public hideMainModal() {
    this.isMainModalVisible$.next(false);
  }

  // choose current sub modal
  // this will be used to determine which sub modal to show
  // Types of sub modal: addBudget, deleteBudget, editBudget, addPot, editPot, deletePot, addMoneyPot, withdrawMoneyPot
  @Output() public currentSubModal$ = new BehaviorSubject<string>('editPot');

  public chooseSubModal(subModal: string) {
    this.currentSubModal$.next(subModal);
  }
}
