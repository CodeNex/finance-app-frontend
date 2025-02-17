import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AuthentificationService } from './authentification.service';
import { BasedataService } from './basedata.service';
import { DataStoreServiceService } from './data-store-service.service';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private http: HttpClient = inject(HttpClient);
  private authentificationService: AuthentificationService = inject(
    AuthentificationService
  );
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  private baseData: BasedataService = inject(BasedataService);
  private router: Router = inject(Router);

  // private baseUrl: string = this.baseData.financeApp.basics.apiData.baseUrl;
  // private baseUrl = '/dummyData';

  private baseUrl: string = this.baseData.financeApp.basics.apiData.baseUrl;

  private dummyEndpoint = this.baseUrl === '/dummyData' ? '.json' : '';

  public warningMessage: string = '';

  constructor() {}

  // GET data from the server
  // endpoints: balance, budgets, pots, transactions
  getData(endpoint: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authentificationService.authToken}`,
      Accept: 'application/json',
    });

    return this.http
      .get(`${this.baseUrl}/${endpoint}${this.dummyEndpoint}`, { headers })
      .pipe(
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
  initialDataLoading() {
    this.loadData('balance');
    this.loadData('transactions');
    this.loadData('budgets');
    this.loadData('pots');
  }

  loadData(endpoint: string) {
    this.loadingScreenTimer();
    this.getData(endpoint).subscribe({
      next: (response) => {
        if (endpoint === 'balance') this.balanceDataLoaded = true;
        if (endpoint === 'budgets') this.budgetsDataLoaded = true;
        if (endpoint === 'pots') this.potsDataLoaded = true;
        if (endpoint === 'transactions') this.transactionsDataLoaded = true;
        this.checkDataLoaded(endpoint);
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

  balanceDataLoaded: boolean = false;
  budgetsDataLoaded: boolean = false;
  potsDataLoaded: boolean = false;
  transactionsDataLoaded: boolean = false;
  isDataLoaded: boolean = false;

  checkDataLoaded(endpoint: string) {
    if (
      this.balanceDataLoaded &&
      this.budgetsDataLoaded &&
      this.potsDataLoaded &&
      this.transactionsDataLoaded
    ) {
      this.authentificationService.setLoadingScreen(false);
      if (endpoint === 'login' || 'guest') this.router.navigate(['/home']);
    }
  }

  loadingScreenTimer() {
    if (!this.isDataLoaded) {
      this.authentificationService.setLoadingScreen(true);
    } else {
      this.authentificationService.setLoadingScreen(false);
    }
  }
}
