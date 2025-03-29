import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';
import { CommonModule } from '@angular/common';
import { SingleTransactionComponent } from './single-transaction/single-transaction.component';

@Component({
  selector: 'app-transactions-summary',
  imports: [
    RouterModule,
    IconsComponent,
    CommonModule,
    SingleTransactionComponent,
  ],
  templateUrl: './transactions-summary.component.html',
  styleUrl: './transactions-summary.component.scss',
})
export class TransactionsSummaryComponent {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  public transactionsArraySignal$: any = this.dataStore.transactions;

  public readyToRenderArray: any[] = [];

  constructor() {
    effect(() => {
      let potsSignal = this.transactionsArraySignal$();
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.readyToRenderArray = this.sortByDate(this.transactionsArraySignal$());
  }

  private sortByDate(array: any) {
    return array.sort((a: any, b: any) => {
      if (!a.execute_on) return 1;
      if (!b.execute_on) return -1;
      return (
        new Date(b.execute_on).getTime() - new Date(a.execute_on).getTime()
      );
    }).slice(0, 4);
  }
}
