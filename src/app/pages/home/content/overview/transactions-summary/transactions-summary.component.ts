import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '../../../../../components/icons/icons.component';

@Component({
  selector: 'app-transactions-summary',
  imports: [RouterModule, IconsComponent],
  templateUrl: './transactions-summary.component.html',
  styleUrl: './transactions-summary.component.scss'
})
export class TransactionsSummaryComponent {

}
