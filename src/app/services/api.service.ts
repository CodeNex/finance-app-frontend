import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { BasedataService } from './basedata.service';
import { DataStoreServiceService } from './data-store-service.service';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private http: HttpClient = inject(HttpClient);
  private AuthenticationService: AuthenticationService = inject(
    AuthenticationService
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

  // Load Data First Time after login
  initialDataLoading() {
    this.loadData('balance');
    this.loadData('transactions');
    this.loadData('budgets');
    this.loadData('pots');
  }

  balanceDataLoaded: boolean = false;
  budgetsDataLoaded: boolean = false;
  potsDataLoaded: boolean = false;
  transactionsDataLoaded: boolean = false;
  transactionsRecurringDataLoaded: boolean = false;
  isDataLoaded: boolean = false;

  loadData(endpoint: string) {
    this.loadingScreenTimer();
    this.getData(endpoint).subscribe({
      next: (response) => {
        if (endpoint === 'balance') this.balanceDataLoaded = true;
        if (endpoint === 'budgets') this.budgetsDataLoaded = true;
        if (endpoint === 'pots') this.potsDataLoaded = true;
        if (endpoint === 'transactions') this.transactionsDataLoaded = true;
        if (endpoint === 'transactions/recurring')
          this.transactionsRecurringDataLoaded = true;
        this.checkDataLoaded(endpoint);
        this.AuthenticationService.setWarningScreen(false);
        this.warningMessage = '';
        console.log(this.dataStore.getStoredData(endpoint));
      },
      error: (error) => {
        console.error(`Fail to fetch ${endpoint} data`, error);
        this.AuthenticationService.setLoadingScreen(false);
        this.warningMessage = `Fail to fetch ${endpoint} data`;
        this.AuthenticationService.setWarningScreen(true);
      },
    });
  }

  // GET data from the server
  // endpoints: balance, budgets, pots, transactions, transactions/recurring
  getData(endpoint: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
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

  checkDataLoaded(endpoint: string) {
    if (
      this.balanceDataLoaded &&
      this.budgetsDataLoaded &&
      this.potsDataLoaded &&
      this.transactionsDataLoaded &&
      this.transactionsRecurringDataLoaded
    ) {
      this.AuthenticationService.setLoadingScreen(false);
      if (endpoint === 'login' || 'guest') this.router.navigate(['/home']);
    }
  }

  loadingScreenTimer() {
    if (!this.isDataLoaded) {
      this.AuthenticationService.setLoadingScreen(true);
    } else {
      this.AuthenticationService.setLoadingScreen(false);
    }
  }

  // PUT data to server
  // endpoints: balance, budgets, pots, transactions
  // updateData(endpoint: string, id: number, body: any): Observable<any> {
  //   let path = '';
  //   id >= 0 ? (path = `/{${id}}`) : (path = '');

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.AuthenticationService.authToken}`,
  //     'Content-Type': 'application/json',
  //     Accept: 'application/json',
  //   });
  //   return this.http
  //     .put(`${this.baseUrl}/${endpoint}${path}`, body, {
  //       headers,
  //     })
  //     .pipe(
  //       tap((response) => {
  //         console.log('Data updated', response);
  //         this.warningMessage = '';
  //         return response;
  //       }),
  //       catchError((error) => {
  //         console.error('Fail to update data', error);
  //         return throwError(() => new Error('Fail to update data'));
  //       })
  //     );
  // }
}
