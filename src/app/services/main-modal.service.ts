import { Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainModalService {
  // #region Service Setup
  @Output() public currentSubModal$ = new BehaviorSubject<string>('');
  @Output() public subModalObject$ = new BehaviorSubject<Object>({});
  @Output() public index$ = new BehaviorSubject<number>(-1);
  @Output() public isMainModalVisible$ = new BehaviorSubject<boolean>(false);

  public showMainModal() {
    this.isMainModalVisible$.next(true);
  }

  public hideMainModal() {
    this.isMainModalVisible$.next(false);
  }
  // #endregion

  /**
   * @description - This function is responsible for showing the submodal.
   * It sets the current submodal, the submodal object, and the index of the submodal.
   * @param subModal - The name / type of the submodal to be shown.
   * @param subModalObject - The object to be passed to the submodal. 
   * @param index - The index of the submodal to be shown. 
   */
  public chooseSubModal(subModal: string, subModalObject: Object, index: number | null) {
    this.showMainModal();
    this.currentSubModal$.next(subModal);
    this.subModalObject$.next(subModalObject);
    if (index !== null) this.index$.next(index);
  }
}
