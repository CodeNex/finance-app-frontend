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


}
