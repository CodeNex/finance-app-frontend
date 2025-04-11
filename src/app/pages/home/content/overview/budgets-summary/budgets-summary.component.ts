import { Component, inject } from '@angular/core';
import { IconsComponent } from '@components/icons/icons.component';
import { RouterModule } from '@angular/router';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';
import { APIService } from '@services/api.service';
import { BudgetOverviewComponent } from '@content/budgets/budget-overview/budget-overview.component';

@Component({
  selector: 'app-budgets-summary',
  imports: [IconsComponent, RouterModule, BudgetOverviewComponent],
  templateUrl: './budgets-summary.component.html',
  styleUrl: './budgets-summary.component.scss'
})
export class BudgetsSummaryComponent {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  

  
}
