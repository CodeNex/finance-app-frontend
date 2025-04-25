import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { IconsComponent } from '@components/icons/icons.component';

/**
 * * * SearchTransactionComponent
 * This component is responsible for displaying the search input field for transactions.
 * It allows the user to search for transactions by entering a search term.
 * It uses the CommonModule for common Angular directives and the IconsComponent for displaying icons.
 */
@Component({
  selector: 'app-search-transaction',
  imports: [CommonModule, IconsComponent],
  templateUrl: './search-transaction.component.html',
  styleUrl: './search-transaction.component.scss'
})
export class SearchTransactionComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  @Output() public searchFieldChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('transactionSearchInputField') public transactionSearchInputField!: ElementRef<HTMLInputElement>;

  public emitSearchFieldChange(input: string) {
    this.searchFieldChange.emit(input);
  }
  // #endregion

  public searchFieldInput(): void {
    let value = this.transactionSearchInputField.nativeElement.value;
    this.emitSearchFieldChange(value);
  }
}
