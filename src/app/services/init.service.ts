import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor() { 
    this.initFunction();
  }


  initFunction() {
    console.log('Init function called');
    
  }
}
