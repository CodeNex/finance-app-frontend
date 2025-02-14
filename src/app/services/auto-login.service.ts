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

  private path: string = '/auto-login';

  private isTokenAvailableFromLocalStorage: boolean = false;

  private token: string = '';

  private isTokenValid: boolean = false;

  constructor() {
    this.checkForToken();
  }

  async checkForToken() {
    let storageJsonToken = await localStorage.getItem(
      'sdio732d_uuw12!#SDo072354°ka'
    );
    if (storageJsonToken === typeof 'string') {
      this.isTokenAvailableFromLocalStorage = true;
      this.token = JSON.parse(storageJsonToken);
    }
    console.log('Token from LocalStorage: ', this.token);
  }

  doTokenValidationRequest() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/json',
    });

    this.http
      .post<{ token: string }>(this.baseUrl + this.path, '', {
        headers: headers,
      })
      .subscribe({
        next: (response) => {},
        error: (error) => {},
      });
  }
}
