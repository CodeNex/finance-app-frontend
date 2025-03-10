import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
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
export class PotsSummaryComponent implements OnInit {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  @Input() public pots: PotsObject[] = [];

  public totalSavings: number = 0;

  public formattedTotalSavings: string = '';

  ngOnInit() {
    this.updateTotalSavings();
    console.log(this.totalSavings);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['pots']) {
      this.updateTotalSavings();
    }
  }

  updateTotalSavings() {
    this.totalSavings = this.getTotalSavedAmount(this.pots);
    this.formattedTotalSavings = this.getformattedValue(this.totalSavings);
  }

  getTotalSavedAmount(potsArray: PotsObject[]): number {
    let totalSavings = 0;
    for (let i = 0; i < potsArray.length; i++) {
      totalSavings += potsArray[i].total;
    }
    return totalSavings;
  }

  getformattedValue(value: number): string {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  }
}


