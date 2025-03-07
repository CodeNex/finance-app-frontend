import { Component, inject, Input } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { RouterModule } from '@angular/router';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';

@Component({
  selector: 'app-pots-summary',
  imports: [IconsComponent, RouterModule],
  templateUrl: './pots-summary.component.html',
  styleUrl: './pots-summary.component.scss'
})
export class PotsSummaryComponent {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  @Input() public pots: PotsObject = {
    id: 0,
    name: 'Savings',
    target: 2000.0,
    total: 159.0,
    theme: '#277C78',
    created_at: null,
    deleted_at: null,
  };
}
