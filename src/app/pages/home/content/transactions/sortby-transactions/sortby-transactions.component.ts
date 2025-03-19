import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sortby-transactions',
  imports: [],
  templateUrl: './sortby-transactions.component.html',
  styleUrl: './sortby-transactions.component.scss'
})
export class SortbyTransactionsComponent {

  @Output() public sortByChange: EventEmitter<string> = new EventEmitter<string>();

  public emitSortByChange(sortBy: string) {
    this.sortByChange.emit(sortBy);
  }

  // sort possibleties: latest, oldest, aToZ, zToA, highest, lowest

  ngOnInit() {
    // setTimeout(() => {
    //   this.emitSortByChange('highest');
    // }, 2000);
  }

}
