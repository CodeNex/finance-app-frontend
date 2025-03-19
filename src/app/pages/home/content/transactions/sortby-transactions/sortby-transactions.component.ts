import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';

@Component({
  selector: 'app-sortby-transactions',
  imports: [CommonModule, IconsComponent],
  templateUrl: './sortby-transactions.component.html',
  styleUrl: './sortby-transactions.component.scss',
})
export class SortbyTransactionsComponent {
  @Output() public sortByChange: EventEmitter<string> =
    new EventEmitter<string>();

  public emitSortByChange(sortBy: string) {
    this.sortByChange.emit(sortBy);
  }

  // array of all sorting options
  public sortByOptions: string[] = [
    'Latest',
    'Oldest',
    'A to Z',
    'Z to A',
    'Highest',
    'Lowest',
  ];
  // current chosen sorting option
  public chosenSortBy: string = 'Latest';
  // boolean to control the dropdown
  public isDropDownOpen: boolean = false;

  ngOnInit() {
    // setTimeout(() => {
    //   this.emitSortByChange('highest');
    // }, 2000);
  }

  public changeSortBy(sortBy: string) {
    this.chosenSortBy = sortBy;
    this.emitSortByChange(sortBy);
  }
}
