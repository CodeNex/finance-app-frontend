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
  @Output() public currentSubModal$ = new BehaviorSubject<string>('');

  public chooseSubModal(subModal: string) {
    this.currentSubModal$.next(subModal);
  }
}
