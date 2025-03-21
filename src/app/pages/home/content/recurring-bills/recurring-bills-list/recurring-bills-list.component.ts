import { Component, effect, inject, Input } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { CommonModule } from '@angular/common';
import { APIService } from '../../../../../services/api.service';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { MainModalService } from '../../../../../services/main-modal.service';
import { SingleTransactionComponent } from '../../overview/transactions-summary/single-transaction/single-transaction.component';
import { SingleBillComponent } from './single-bill/single-bill.component';

@Component({
  selector: 'app-recurring-bills-list',
  imports: [SingleBillComponent, IconsComponent, CommonModule],
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
