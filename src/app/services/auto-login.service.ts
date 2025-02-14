import { Injectable, inject } from '@angular/core';

import { AuthentificationService } from './authentification.service';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginService {

  public authService: AuthentificationService = inject(AuthentificationService);
  public apiService: APIService = inject(APIService);

  constructor() { }
}
