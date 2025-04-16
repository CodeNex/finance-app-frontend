import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AuthenticationService } from '@services/authentication.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';

/**
 * * APIService
 * This service is responsible for handling API requests and data loading in the application.
 * It uses the HttpClient to make requests to the server and manages the data using the DataStoreService.
 * It provides methods to load data from the server and store it in the DataStoreService.
 */
@Injectable({
  providedIn: 'root',
})
export class APIService {
  // #region Service Setup
  private http = inject(HttpClient);
  private authService = inject(AuthenticationService);
  private dataStore = inject(DataStoreServiceService);
  private baseData = inject(BasedataService);
  private router = inject(Router);

  private baseUrl: string = this.baseData.baseUrl;

  private dummyEndpoint = this.baseUrl === '/dummyData' ? '.json' : '';

  public warningMessage = signal<string>('');

  balanceDataLoaded: boolean = false;
  budgetsDataLoaded: boolean = false;
  potsDataLoaded: boolean = false;
  transactionsDataLoaded: boolean = false;
  transactionsRecurringDataLoaded: boolean = false;
  isDataLoaded: boolean = false;
  // #endregion

  /**
   * @description - This function is responsible for initial loading the data from the server.
   */
  public initialDataLoading(): void {
    this.loadData('balance');
    this.loadData('transactions');
    this.loadData('budgets');
    this.loadData('pots');
    this.loadData('recurrings');
  }

  /**
   * @description - This function is responsible for loading the data from the server.
   * @param endpoint - The endpoint to load data from the server.
   */
  private loadData(endpoint: string) {
    this.loadingScreenTimer();
    this.getData(endpoint).subscribe({
      next: (response) => {
        if (endpoint === 'balance') this.balanceDataLoaded = true;
        if (endpoint === 'budgets') this.budgetsDataLoaded = true;
        if (endpoint === 'pots') this.potsDataLoaded = true;
        if (endpoint === 'transactions') this.transactionsDataLoaded = true;
        if (endpoint === 'recurrings')
          this.transactionsRecurringDataLoaded = true;
        this.checkDataLoaded(endpoint);
        this.authService.setWarningScreen(false);
        this.warningMessage.set('');
        console.log(this.dataStore.getStoredData(endpoint));
      },
      error: (error) => {
        console.error(`Fail to fetch ${endpoint} data`, error);
        this.authService.setLoadingScreen(false);
        this.warningMessage.set(`Fail to fetch ${endpoint} data`);
        this.authService.setWarningScreen(true);
      },
    });
  }

  /**
   * @description - This function is responsible for loading the data from the server.
   * It uses the HttpClient to make a GET request to the server and returns an observable.
   * @param endpoint - The endpoint to load data from the server.
   * @returns - An observable that emits the response from the server.
   */
  // endpoints: balance, budgets, pots, transactions, recurrings
  private getData(endpoint: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.authToken}`,
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

  /**
   * @description - This function is responsible for checking if all the data is loaded.
   * @param endpoint - The endpoint to check if the data is loaded.
   */
  private checkDataLoaded(endpoint: string): void {
    if (
      this.balanceDataLoaded &&
      this.budgetsDataLoaded &&
      this.potsDataLoaded &&
      this.transactionsDataLoaded &&
      this.transactionsRecurringDataLoaded
    ) {
      this.authService.setLoadingScreen(false);
      if (endpoint === 'login' || 'guest') this.router.navigate(['/home']);
    }
  }

  /**
   * @description - This function is responsible for setting the loading screen timer.
   * It checks if the data is loaded and sets the loading screen within the AuthenticationService.
   */
  private loadingScreenTimer(): void {
    if (!this.isDataLoaded) {
      this.authService.setLoadingScreen(true);
    } else {
      this.authService.setLoadingScreen(false);
    }
  }
}
