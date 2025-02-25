import { Component, inject } from '@angular/core';
import { APIService } from '../../services/api.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-warning-screen',
  imports: [],
  templateUrl: './warning-screen.component.html',
  styleUrl: './warning-screen.component.scss',
})
export class WarningScreenComponent {
  private apiService: APIService = inject(APIService);
  private authService: AuthenticationService = inject(AuthenticationService);

  warningMessageApi: string = this.apiService.warningMessage;
  warningMessageAuth: string = this.authService.authWarningMessage;
}
