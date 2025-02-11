import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private baseUrl: string = 'http://localhost:3000';

  public authToken: string = '';

  ngOnInit() {}
}
