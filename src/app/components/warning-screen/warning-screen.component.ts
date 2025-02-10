import { Component, inject } from '@angular/core';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'app-warning-screen',
  imports: [],
  templateUrl: './warning-screen.component.html',
  styleUrl: './warning-screen.component.scss',
})
export class WarningScreenComponent {

  private apiService: APIService = inject(APIService);
  warningMessage: string = this.apiService.warningMessage;
}
