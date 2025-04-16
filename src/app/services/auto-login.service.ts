import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BasedataService } from '@services/basedata.service';
import { AuthenticationService } from '@services/authentication.service';
import { APIService } from '@services/api.service';

/**
 * * * AutoLoginService
 * This service is responsible for handling the auto-login functionality in the application.
 * It checks if the user has a valid token in local storage and automatically logs them in if the token is valid.
 * It uses the HttpClient to make requests to the server and manages the authentication state.
 */
@Injectable({
  providedIn: 'root',
})
export class AutoLoginService {
  // #region Service Setup
  private baseData = inject(BasedataService);
  public authService= inject(AuthenticationService);
  public apiService = inject(APIService);
  private http = inject(HttpClient);

  private baseUrl: string = this.baseData.baseUrl;

  private path: string = '/check-auth';

  private token: string = '';
  // #endregion

  // #region LifeCycle Hooks
  constructor() {
    this.checkForToken();
  }
  // #endregion

  /**
   * * @description - This function is responsible for checking if the token is available in local storage.
   * If the token is available, it sends a request to the server to validate the token.
   */
  async checkForToken() {
    let storageJsonToken = await localStorage.getItem(
      this.baseData.tokenKey
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

  /**
   * * @description - This function is responsible for validating the token.
   * It sends a request to the server to check if the token is valid or not.
   */
  doTokenValidationRequest() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/json',
    });
    this.http
      .post<{ token: string }>(
        this.baseUrl + this.path,
        {},
        {
          headers: headers,
        }
      )
      .subscribe({
        next: (response) => {
          this.doAutoLogin();
        },
        error: (error) => {
          console.log('Token is invalid: ', error);
        },
      });
  }

  /**
   * * @description - This function is responsible for logging in the user automatically.
   * It uses the token from local storage to authenticate the user and load the initial data.
   */
  doAutoLogin() {
    this.authService.authToken = this.token;
    this.authService.setLoadingScreen(true);
    this.apiService.initialDataLoading();
  }
}
