import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainModalService {

  constructor() { }

  public isMainModalVisible: boolean = true;

  public showMainModal() {
    this.isMainModalVisible = true;
  }

  public hideMainModal() {
    console.log('hideMainModal');
    
    this.isMainModalVisible = false;
  }
}
