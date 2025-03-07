import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { RouterModule } from '@angular/router';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';

@Component({
  selector: 'app-budgets-summary',
  imports: [IconsComponent, RouterModule],
  templateUrl: './budgets-summary.component.html',
  styleUrl: './budgets-summary.component.scss'
})
export class BudgetsSummaryComponent {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  @Input() public budgets: BudgetsObject = {
    id: 1,
    name: 'Transportation',
    amount: 56.26,
    maximum: 419.89,
    theme: '#93674F',
    deleted_at: null,
    created_at: '2025-02-24T16:14:01.000000Z',
  };

  
}
