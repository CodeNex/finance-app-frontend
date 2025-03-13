import { Component, effect, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';

@Component({
  selector: 'app-pots-summary',
  imports: [IconsComponent, RouterModule, CommonModule],
  templateUrl: './pots-summary.component.html',
  styleUrl: './pots-summary.component.scss'
})
export class PotsSummaryComponent implements OnInit {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  public potsArray: any = this.dataStore.pots;

  public totalSavings: number = 0;

  public formattedTotalSavings: string = '';

  constructor() {
    effect(() => {
      let potsSignal = this.potsArray();
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.updateTotalSavings();
  }

  updateTotalSavings() {
    this.totalSavings = this.getTotalSavedAmount(this.potsArray());
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


