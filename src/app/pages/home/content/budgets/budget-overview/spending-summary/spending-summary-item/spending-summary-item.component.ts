import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

@Component({
  selector: 'app-spending-summary-item',
  imports: [CommonModule],
  templateUrl: './spending-summary-item.component.html',
  styleUrl: './spending-summary-item.component.scss',
})
export class SpendingSummaryItemComponent {
  @Input() public summaryItem: any = {
    amount: 0,
    created_at: null,
    deleted_at: null,
    id: -11,
    last_spendings: [],
    maximum: -1,
    name: 'Example',
    theme: '#93674F',
  };

  ngOnInit() {
    console.log(this.summaryItem);
  }
}
