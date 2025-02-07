import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
    if (this.dataStore.getBalance()) {
      return of (this.dataStore.getBalance()
      )
    }
    return this.http.get(`${this.baseUrl}balance.json`).pipe(
      tap((data: any) => this.dataStore.setBalance(data))
    );
  }

  // Update: PUT Balance
  updateBalance(newBalance: any): Observable<any> {
    this.dataStore.setBalance(newBalance);
    return of(newBalance);
  }

  // GET: call Budgets
  getBudgets(): Observable<any[]> {
    if (this.dataStore.getBudgets().length > 0) {
      return of(this.dataStore.getBudgets());
    }
    return this.http.get<any[]>(`${this.baseUrl}budgets.json`).pipe(
      tap(data => this.dataStore.setBudgets(data))
    );
  }

  // POST: add New Budgets
  addBudget(newBudget: any): Observable<any> {
    const budgets = [...this.dataStore.getBudgets(), newBudget];
    this.dataStore.setBudgets(budgets);
    return of(newBudget);
  }

  // DELETE: delete Budgets
  deleteBudget(id: number): Observable<any> {
    const budgets = this.dataStore.getBudgets().filter(b => b.id !== id);
    this.dataStore.setBudgets(budgets);
    return of({ success: true });
  }

   // GET: Pots abrufen
   getPots(): Observable<any[]> {
    if (this.dataStore.getPots().length > 0) {
      return of(this.dataStore.getPots());
    }
    return this.http.get<any[]>(`${this.baseUrl}pots.json`).pipe(
      tap(data => this.dataStore.setPots(data))
    );
  }

  // GET: Transactions abrufen
  getTransactions(): Observable<any[]> {
    if (this.dataStore.getTransactions().length > 0) {
      return of(this.dataStore.getTransactions());
    }
    return this.http.get<any[]>(`${this.baseUrl}transactions.json`).pipe(
      tap(data => this.dataStore.setTransactions(data))
    );
  }
}
