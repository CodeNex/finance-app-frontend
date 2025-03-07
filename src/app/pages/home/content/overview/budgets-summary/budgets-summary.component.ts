import { Component } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-budgets-summary',
  imports: [IconsComponent, RouterModule],
  templateUrl: './budgets-summary.component.html',
  styleUrl: './budgets-summary.component.scss'
})
export class BudgetsSummaryComponent {

}
