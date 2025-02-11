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

  private baseUrl: string = 'http://localhost:3000';

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

  public loadingScreenLogin: boolean = false;

  public loadingScreenRegister: boolean = false;

  public authToken: string = '';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  //authOption: 'login' | 'register' | 'guest'
  doAuthentificationRequest(authOption: string, body: any) {
    let path;
    if (authOption === 'login' || 'guest') path = this.loginPath;
    if (authOption === 'register') path = this.registerPath;

    this.http
      .post<{ token: string }>(this.baseUrl + path, body, {
        headers: this.headers,
      })
      .subscribe({
        next: (response) => {
          this.setWarningScreen(false);
          this.authWarningMessage = '';
          this.authToken = response.token;
          if (authOption === 'login' || 'guest' || 'register') this.router.navigate(['/home']);  
        },
        error: (error) => {
          this.setWarningScreen(true);
          this.authWarningMessage = error.message;
        },
      });
  }
}
