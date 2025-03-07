import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';

@Component({
  selector: 'app-transactions-summary',
  imports: [RouterModule, IconsComponent],
  templateUrl: './transactions-summary.component.html',
  styleUrl: './transactions-summary.component.scss'
})
export class TransactionsSummaryComponent {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  @Input() public transactions: any;
}
