import { Component, inject } from '@angular/core';
import { APIService } from '@services/api.service';
import { AuthenticationService } from '@services/authentication.service';

/**
 * * * WarningScreenComponent
 * This component is responsible for displaying a warning screen in the application.
 * It shows a warning message to the user when there is an issue with loading data from the server * after login.
 * It uses the APIService to get the warning message and the AuthenticationService to manage the authentication state.
 */
@Component({
  selector: 'app-warning-screen',
  imports: [],
  templateUrl: './warning-screen.component.html',
  styleUrl: './warning-screen.component.scss',
})
export class WarningScreenComponent {
  private apiService = inject(APIService);
  private authService = inject(AuthenticationService);

  warningMessageApi: string = this.apiService.warningMessage();
  warningMessageAuth: string = this.authService.authWarningMessage();
}
