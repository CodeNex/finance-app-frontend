import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private http: HttpClient = inject(HttpClient);

  private baseUrl: string = 'http://localhost:3000';

  private loginPath: string = '/login';

  private registerPath: string = '/register';

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
          if (authOption === 'login' || 'guest') this.authWarningMessage = '';
          if (authOption === 'register') this.authWarningMessage = '';
          this.authToken = response.token;
          console.log('Auth token:', this.authToken);
          return 'true';
          
        },
        error: (error) => {
          // if (authOption === 'login' || 'guest') this.warningScreenLogin = true;
          // if (authOption === 'register') this.warningScreenRegister = true;
          this.authWarningMessage = error.message;
          console.log('Error:', error);
          
        },
      });
  }
}
