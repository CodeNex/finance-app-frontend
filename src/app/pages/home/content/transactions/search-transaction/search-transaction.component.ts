import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';

@Component({
  selector: 'app-search-transaction',
  imports: [CommonModule, IconsComponent],
  templateUrl: './search-transaction.component.html',
  styleUrl: './search-transaction.component.scss'
})
export class SearchTransactionComponent {

  @Output() public searchFieldChange: EventEmitter<string> = new EventEmitter<string>();

  public emitSearchFieldChange(input: string) {
    this.searchFieldChange.emit(input);
  }

  ngOnInit() {
      this.emitSearchFieldChange(''); 
  }

  public searchFieldInput() {
    let field = document.getElementById('transactionSearchInputField') as HTMLInputElement;
    let value = field.value;
    this.emitSearchFieldChange(value);
  }
}
