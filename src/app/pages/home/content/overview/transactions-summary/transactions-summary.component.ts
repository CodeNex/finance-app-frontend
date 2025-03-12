import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { APIService } from '../../../../../services/api.service';
import { CommonModule } from '@angular/common';
import { SingleTransactionComponent } from './single-transaction/single-transaction.component';

@Component({
  selector: 'app-transactions-summary',
  imports: [RouterModule, IconsComponent, CommonModule, SingleTransactionComponent],
  templateUrl: './transactions-summary.component.html',
  styleUrl: './transactions-summary.component.scss'
})
export class TransactionsSummaryComponent implements OnInit {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  public transactionsArray: any = this.dataStore.transactions;

  constructor() {
    effect(() => {
      let potsSignal = this.transactionsArray();
      this.ngOnInit();
    });
  }
  ngOnInit() {
    // console.log(this.transactionsArray());
    
  }
}
