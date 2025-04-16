import { Injectable, inject, Injector, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { APIService } from '@services/api.service';
import { BasedataService } from '@services/basedata.service';

/**
 * * * AuthenticationService
 * This service is responsible for handling authentication in the application.
 * It uses the HttpClient to make requests to the server and manages the authentication state.
 * It provides methods to log in, register, and log out the user.
 * It also provides methods to show and hide the loading and warning screens.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private baseData = inject(BasedataService);
  private router = inject(Router);

  private baseUrl: string = this.baseData.baseUrl;

  private loginPath: string = '/login';
  private registerPath: string = '/register';
  private logoutPath: string = '/logout';

  public isWarningScreenVisible = new BehaviorSubject<boolean>(false);
  isWarningScreenVisible$ = this.isWarningScreenVisible.asObservable();

  public setWarningScreen(value: boolean): void {
    this.isWarningScreenVisible.next(value);
  }

  public isLoadingScreenVisible = new BehaviorSubject<boolean>(false);
  isloadingScreenVisible$ = this.isLoadingScreenVisible.asObservable();

  public setLoadingScreen(value: boolean): void {
    this.isLoadingScreenVisible.next(value);
  }

  public authWarningMessage = signal<string>('');
  public authToken: string = '';
  public isFirstRender: boolean = true;

  /**
   * Sets internal flag to persist auth token in localStorage (used by LoginForm)
   * */
  public saveTokenInLocalStorage: boolean = false;

  public set tokenToLocalStorage(value: boolean) {
    this.saveTokenInLocalStorage = value;
  }

  /**
   * @description - This function is responsible for loading the data from the server.
   * @param authOption - The authentication option to be used (login, register, guest)
   * @param body - The body of the request to be sent to the server 
   */
  // authOptions: 'login' | 'register' | 'guest'
  doAuthenticationRequest(authOption: string, body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      withCredentials: 'true',
    });
    setTimeout(() => {
      if (this.authToken === '') this.setLoadingScreen(true);
    }, 250);
    let path;
    if (authOption === 'login' || 'guest') path = this.loginPath;
    if (authOption === 'register') path = this.registerPath;
    this.http
      .post<{ token: string }>(this.baseUrl + path, body, {
        headers,
      })
      .subscribe({
        next: (response) => {
          if (this.saveTokenInLocalStorage)
            this.setTokenToLocalStorage(response.token);
          this.authWarningMessage.set('');
          this.authToken = response.token;
          this.startApiFirstDataLoading();
          console.log(this.authToken);
          
        },
        error: (error) => {
          this.setLoadingScreen(false);
          this.setWarningScreen(true);
          this.authWarningMessage.set(error.message);
        },
      });
  }

  /**
   * * @description - This function is responsible for logging out the user.
   * It uses the HttpClient to make a POST request to the server and removes the token from local storage.
   */
  public doLogOut() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    this.http
      .post<{ token: string }>(this.baseUrl + this.logoutPath, {}, { headers })
      .subscribe({
        next: (response) => {
          console.log('Logout successful', response);
          this.authToken = '';
          localStorage.removeItem(
            `${this.baseData.tokenKey}`
          );
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error('Fail to logout', error);
        },
      });
  }

  /**
   * @description - This function is responsible for loading the initial data from the server.
   */
  private startApiFirstDataLoading() {
    const apiService = this.injector.get(APIService);
    return apiService.initialDataLoading();
  }

  /**
   * @description - This function is responsible for setting the warning message.
   * @param token - The token to be set in local storage
   */
  private setTokenToLocalStorage(token: string): void {
    let jsonToken = JSON.stringify(token);
    localStorage.setItem(
      this.baseData.tokenKey,
      jsonToken
    );
  }
}
