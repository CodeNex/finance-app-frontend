import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BasedataService } from './basedata.service';
import { AuthentificationService } from './authentification.service';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginService {
  private baseData: BasedataService = inject(BasedataService);
  public authService: AuthentificationService = inject(AuthentificationService);
  public apiService: APIService = inject(APIService);
  private http: HttpClient = inject(HttpClient);

  private baseUrl: string = this.baseData.financeApp.basics.apiData.baseUrl;

  private path: string = '/check-auth';

  private token: string = '';

  private isTokenValid: boolean = false;

  constructor() {
    this.checkForToken();
  }

  async checkForToken() {
    let storageJsonToken = await localStorage.getItem(
      this.baseData.financeApp.basics.apiData.localStorage.tokenKey
    );
    
    
    if (
      typeof storageJsonToken === 'string' &&
      storageJsonToken !== null &&
      storageJsonToken.length > 0
    ) {
      console.log('Token from LocalStorage: ', storageJsonToken);
      this.token = JSON.parse(storageJsonToken);
      this.doTokenValidationRequest();
    } else {
      return console.log('No token available in LocalStorage');
    }
    console.log('Token from LocalStorage: ', this.token);
  }

  doTokenValidationRequest() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/json',
    });

    this.http
      .post<{ token: string }>(this.baseUrl + this.path, {}, {
        headers: headers,
      })
      .subscribe({
        next: (response) => {
          this.doAutoLogin();
        },
        error: (error) => {
          console.log('Token is invalid: ', error);
        },
      });
  }

  doAutoLogin() {
    this.authService.authToken = this.token;
    this.authService.setLoadingScreen(true);
    this.apiService.initialDataLoading();
  }
}
