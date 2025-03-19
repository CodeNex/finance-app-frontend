import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-transaction',
  imports: [],
  templateUrl: './search-transaction.component.html',
  styleUrl: './search-transaction.component.scss'
})
export class SearchTransactionComponent {

  @Output() public searchFieldChange: EventEmitter<string> = new EventEmitter<string>();

  public emitSearchFieldChange(input: string) {
    this.searchFieldChange.emit(input);
  }

  ngOnInit() {}
}
