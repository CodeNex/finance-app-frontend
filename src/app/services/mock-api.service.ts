import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  private baseUrl = "/public/dummyData/";

  constructor(private http: HttpClient) { }

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
