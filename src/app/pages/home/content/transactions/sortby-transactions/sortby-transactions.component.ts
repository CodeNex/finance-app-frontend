import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sortby-transactions',
  imports: [],
  templateUrl: './sortby-transactions.component.html',
  styleUrl: './sortby-transactions.component.scss',
})
export class SortbyTransactionsComponent {
  @Output() public sortByChange: EventEmitter<string> =
    new EventEmitter<string>();

  public emitSortByChange(sortBy: string) {
    this.sortByChange.emit(sortBy);
  }

  public sortByOptions: string[] = [
    'Latest',
    'Oldest',
    'A to Z',
    'Z to A',
    'Highest',
    'Lowest',
  ];

  public chosenSortBy: string = 'latest';

  ngOnInit() {
    // setTimeout(() => {
    //   this.emitSortByChange('highest');
    // }, 2000);
  }
}
