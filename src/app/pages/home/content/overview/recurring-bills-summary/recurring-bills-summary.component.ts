import { Component, inject, Input } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { RouterModule } from '@angular/router';
import { APIService } from '../../../../../services/api.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';

@Component({
  selector: 'app-recurring-bills-summary',
  imports: [IconsComponent, RouterModule],
  templateUrl: './recurring-bills-summary.component.html',
  styleUrl: './recurring-bills-summary.component.scss'
})
export class RecurringBillsSummaryComponent {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  @Input() recurringBills : any;
}
