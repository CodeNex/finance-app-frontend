import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainModalService {

  constructor() { }

  public isMainModalVisible: boolean = false;

  public showMainModal() {
    this.isMainModalVisible = true;
  }

  public hideMainModal() {
    this.isMainModalVisible = false;
  }
}
