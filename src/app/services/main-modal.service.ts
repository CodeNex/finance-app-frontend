import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainModalService {

  constructor() { }

  public isMainModalVisible: boolean = false;
}
