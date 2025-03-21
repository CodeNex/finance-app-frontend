import { Component, effect, inject, Input } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { CommonModule } from '@angular/common';
import { APIService } from '../../../../../services/api.service';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { MainModalService } from '../../../../../services/main-modal.service';

@Component({
  selector: 'app-recurring-bills-list',
  imports: [],
  templateUrl: './recurring-bills-list.component.html',
  styleUrl: './recurring-bills-list.component.scss'
})
export class RecurringBillsListComponent {
  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public mainModalService: MainModalService = inject(MainModalService);

  @Input() public recurringBillsArray$!: TransactionsObject[];
}
