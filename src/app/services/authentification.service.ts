import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private http: HttpClient = inject(HttpClient);

  private router: Router = inject(Router);

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

          this.setLoadingScreen(false);
          this.setWarningScreen(false);

          if (authOption === 'login' || 'guest' || 'register') this.router.navigate(['/home']); 
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
}
