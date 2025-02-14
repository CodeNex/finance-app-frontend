import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthentificationService } from './authentification.service';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginService {

  public authService: AuthentificationService = inject(AuthentificationService);
  public apiService: APIService = inject(APIService);

  private isTokenAvailableFromLocalStorage: boolean = false;

  private token: string = '';

  private isTokenValid: boolean = false;

  constructor() {
    this.checkForToken();
   }

  async checkForToken() {
    let storageJsonToken = await localStorage.getItem('sdio732d_uuw12!#SDo072354°ka');
    if (storageJsonToken === typeof 'string') {
      this.isTokenAvailableFromLocalStorage = true;
      this.token = JSON.parse(storageJsonToken); 
    }
    console.log('Token from LocalStorage: ', this.token);
  }

  function() {
    console.log('AutoLoginService');
    
  }
}
