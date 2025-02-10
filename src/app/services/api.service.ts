import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { LoginService } from './login.service';
import { DataStoreServiceService } from './data-store-service.service';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  private baseUrl = "/public/dummyData/";
  private http: HttpClient = inject(HttpClient);
  private logIn: LoginService = inject(LoginService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  constructor() { }
}
