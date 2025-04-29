import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillsSummaryComponent } from '@content/recurring-bills/bills-summary/bills-summary.component';

/**
 * * * * RecurringBillsSummaryComponent
 * This component is responsible for displaying the summary of recurring bills.
 * It includes the bills summary component and allows for navigation to the bills page.
 * It takes an input property `inWhichSection` to determine the section in which it is displayed.
 */
@Component({
  selector: 'app-recurring-bills-summary',
  imports: [ RouterModule, BillsSummaryComponent],
  templateUrl: './recurring-bills-summary.component.html',
  styleUrl: './recurring-bills-summary.component.scss'
})
export class RecurringBillsSummaryComponent {

  @Input() inWhichSection: string = "";

}
