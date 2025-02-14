import { Injectable, inject, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { APIService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private http: HttpClient = inject(HttpClient);

  private injector = inject(Injector);

  private baseUrl: string = 'https://finance.code-nex.de/api';

  // private baseUrl: string = 'http://localhost:3000';

  private loginPath: string = '/login';

  private registerPath: string = '/register';

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

  public authWarningMessage: string = '';

  public authToken: string = '';

  public isFirstRender: boolean = true;

  public saveTokenInLocalStorage: boolean = false;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  //authOption: 'login' | 'register' | 'guest'
  doAuthentificationRequest(authOption: string, body: any) {
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
          this.authWarningMessage = '';
          this.authToken = response.token;
          this.startApiFirstDataLoading();
          console.log('Auth-Token:', this.authToken); 
        },
        error: (error) => {
          this.setLoadingScreen(false);
          this.setWarningScreen(true);
          this.authWarningMessage = error.message;
          console.log('Error:', this.authWarningMessage);
        },
      });
  }

  startApiFirstDataLoading() {
    const apiService = this.injector.get(APIService);
    return apiService.loadDataFirstTime();
  }

  setTokenToLocalStorage(token: string) {
    let jsonToken = JSON.stringify(token); 
    localStorage.setItem('sdio732d_uuw12!#SDo072354°ka', jsonToken);
  }
}
