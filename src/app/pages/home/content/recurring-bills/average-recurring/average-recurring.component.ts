import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-average-recurring',
  imports: [CommonModule],
  templateUrl: './average-recurring.component.html',
  styleUrl: './average-recurring.component.scss'
})
export class AverageRecurringComponent {
// #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public selectedTimeWindow: string = 'monthly';
  public selectedTimeWindowName: string = 'This Month';

  public timeFrames: TimeFrame[] = [
    { name: 'per Month', value: 'monthly' },
    { name: 'per Quarter', value: 'quarterly' },
    { name: 'per Year', value: 'yearly' },
  ];
// #endregion

// #region Helper Functions
  public isDropDownOpen: boolean = false;

  public toggleDropDown(): void {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  public updateTimeWindow(timeFrame: TimeFrame) {
    this.selectedTimeWindow = timeFrame.value;
    this.selectedTimeWindowName = timeFrame.name;
  }
// #endregion

}
