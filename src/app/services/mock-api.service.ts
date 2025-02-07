import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { DataStoreServiceService } from './data-store-service.service';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  private baseUrl = "/public/dummyData/";
  private http: HttpClient = inject(HttpClient);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  constructor() { }

  // GET: call Balance 
  getBalance(): Observable<any> {
    return this.http.get(`${this.baseUrl}balance.json`);
  }

  // GET: call Budgets
  getBudgets(): Observable<any> {
    return this.http.get(`${this.baseUrl}budgets.json`);
  }

  // GET: call Pots
  getPots(): Observable<any> {
    return this.http.get(`${this.baseUrl}pots.json`);
  }

  // GET: call Transactions
  getTransactions(): Observable<any> {
    return this.http.get(`${this.baseUrl}transactions.json`);
  }
}
