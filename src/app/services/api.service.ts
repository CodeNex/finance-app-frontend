import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { DataStoreServiceService } from './data-store-service.service';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private baseUrl = '/dummyData';
  private http: HttpClient = inject(HttpClient);
  private authentificationService: AuthentificationService = inject(
    AuthentificationService
  );
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public warningMessage: string = '';

  constructor() {}

  // GET data from the server
  // endpoints: balance, budgets, pots, transactions
  getData(endpoint: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authentificationService.authToken}`,
      Accept: 'application/json',
    });

    return this.http.get(`${this.baseUrl}/${endpoint}.json`, { headers }).pipe(
      tap((Response) => {
        this.dataStore.setStoredData(endpoint, Response);
      }),
      catchError((error) => {
        console.error('Fail to fetch data', error);
        return throwError(() => new Error('Fail to fetch data'));
      })
    );
  }

  // PUT data to server
  // endpoints: balance, budgets, pots, transactions
  updateData(endpoint: string, id: number, body: any): Observable<any> {
    let path = '';
    id >= 0 ? (path = `/{${id}}`) : (path = '');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authentificationService.authToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http
      .put(`${this.baseUrl}/${endpoint}${path}`, body, {
        headers,
      })
      .pipe(
        tap((response) => {
          console.log('Data updated', response);
          this.warningMessage = '';
          return response;
        }),
        catchError((error) => {
          console.error('Fail to update data', error);
          return throwError(() => new Error('Fail to update data'));
        })
      );
  }

  // Load Data First Time after login
  loadDataFirstTime() {
    this.loadData('balance');
    this.loadData('transactions');
    this.loadData('budgets');
    this.loadData('pots');
    console.log('Loading data first time');
  }

  balanceDataLoaded: boolean = false;
  budgetsDataLoaded: boolean = false;
  potsDataLoaded: boolean = false;
  transactionsDataLoaded: boolean = false;
  isDataLoaded: boolean = false;

  checkDataLoaded() {
    if (
      this.balanceDataLoaded &&
      this.budgetsDataLoaded &&
      this.potsDataLoaded &&
      this.transactionsDataLoaded
    ) {
      // this.isDataLoaded = true;
      this.authentificationService.setLoadingScreen(false);
    }
  }

  loadingScreenTimer() {
    // setTimeout(() => {
      if (!this.isDataLoaded) {
        this.authentificationService.setLoadingScreen(true);
      } else {
        this.authentificationService.setLoadingScreen(false);
      }
    // }, 300);
  }

  loadData(endpoint: string) {
    this.loadingScreenTimer();
    this.getData(endpoint).subscribe({
      next: (response) => {
        // console.log(`${endpoint} data fetched`, response);
        switch (endpoint) {
          case 'balance':
            this.balanceDataLoaded = true;
            break;
          case 'budgets':
            this.budgetsDataLoaded = true;
            break;
          case 'pots':
            this.potsDataLoaded = true;
            break;
          case 'transactions':
            this.transactionsDataLoaded = true;
            break;
        }
        this.checkDataLoaded();
        // this.authentificationService.setLoadingScreen(false);
        this.authentificationService.setWarningScreen(false);
        this.warningMessage = '';
        console.log(this.dataStore.getStoredData(endpoint));
      },
      error: (error) => {
        console.error(`Fail to fetch ${endpoint} data`, error);
        this.authentificationService.setLoadingScreen(false);
        this.warningMessage = `Fail to fetch ${endpoint} data`;
        this.authentificationService.setWarningScreen(true);
      },
    });
  }
}
