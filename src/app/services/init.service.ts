import { Injectable, inject } from '@angular/core';

import { APIService } from './api.service';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private apiService: APIService = inject(APIService);
  private authService: AuthentificationService = inject(AuthentificationService);

  constructor() { 
    this.initFunction();
  }

  initFunction() {
    console.log('Init function called');
    
  }
}
