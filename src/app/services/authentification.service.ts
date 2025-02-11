import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private baseUrl: string = 'http://localhost:3000';

  private loginPath: string = '/login';

  private registerPath: string = '/register';

  public header: any = {};

  public body: any = {};

  public authToken: string = '';

  ngOnInit() {}
}
