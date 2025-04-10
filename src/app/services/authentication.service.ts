import { Injectable, inject, Injector, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { APIService } from '@services/api.service';
import { BasedataService } from '@services/basedata.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private baseData = inject(BasedataService);
  private router = inject(Router);

  private baseUrl: string = this.baseData.financeApp.basics.apiData.baseUrl;

  private loginPath: string = '/login';
  private registerPath: string = '/register';
  private logoutPath: string = '/logout';

  public isWarningScreenVisible = new BehaviorSubject<boolean>(false);
  isWarningScreenVisible$ = this.isWarningScreenVisible.asObservable();
  setWarningScreen(value: boolean) {
    this.isWarningScreenVisible.next(value);
  }

  public isLoadingScreenVisible = new BehaviorSubject<boolean>(false);
  isloadingScreenVisible$ = this.isLoadingScreenVisible.asObservable();
  setLoadingScreen(value: boolean) {
    this.isLoadingScreenVisible.next(value);
  }

  public authWarningMessage = signal<string>('');

  public authToken: string = '';

  public isFirstRender: boolean = true;

  public saveTokenInLocalStorage: boolean = false;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    withCredentials: 'true',
  });

  //authOption: 'login' | 'register' | 'guest'
  doAuthenticationRequest(authOption: string, body: any) {
    setTimeout(() => {
      if (this.authToken === '') this.setLoadingScreen(true);
    }, 250);
    let path;
    if (authOption === 'login' || 'guest') path = this.loginPath;
    if (authOption === 'register') path = this.registerPath;
    this.http
      .post<{ token: string }>(this.baseUrl + path, body, {
        headers: this.headers,
      })
      .subscribe({
        next: (response) => {
          if (this.saveTokenInLocalStorage)
            this.setTokenToLocalStorage(response.token);
          this.authWarningMessage.set('');
          this.authToken = response.token;
          this.startApiFirstDataLoading();
        },
        error: (error) => {
          this.setLoadingScreen(false);
          this.setWarningScreen(true);
          this.authWarningMessage.set(error.message);
        },
      });
  }

  startApiFirstDataLoading() {
    const apiService = this.injector.get(APIService);
    return apiService.initialDataLoading();
  }

  setTokenToLocalStorage(token: string) {
    let jsonToken = JSON.stringify(token);
    localStorage.setItem(
      this.baseData.financeApp.basics.apiData.localStorage.tokenKey,
      jsonToken
    );
  }

  doLogOut() {
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
            `${this.baseData.financeApp.basics.apiData.localStorage.tokenKey}`
          );
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error('Fail to logout', error);
        },
      });
  }
}
