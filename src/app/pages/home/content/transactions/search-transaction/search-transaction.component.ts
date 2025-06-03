import { CommonModule, AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  Component,
  Output,
  OnInit,
  OnDestroy,
  EventEmitter,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { IconsComponent } from '@components/icons/icons.component';

import { ScreensizeService } from '@src/services/screensize.service';

/**
 * * * SearchTransactionComponent
 * This component is responsible for displaying the search input field for transactions.
 * It allows the user to search for transactions by entering a search term.
 * It uses the CommonModule for common Angular directives and the IconsComponent for displaying icons.
 * It also uses the ScreensizeService to determine if the screen size is small tablet or not.
 * The component emits an event when the search field changes, allowing parent components to react to the change.
 */
@Component({
  selector: 'app-search-transaction',
  imports: [CommonModule, IconsComponent],
  templateUrl: './search-transaction.component.html',
  styleUrl: './search-transaction.component.scss',
})
export class SearchTransactionComponent implements OnInit, OnDestroy {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private screenSizeService = inject(ScreensizeService);

  private searchTransactionSubscriptions$: Subscription = new Subscription();

  @Output() public searchFieldChange: EventEmitter<string> =
    new EventEmitter<string>();

  @ViewChild('transactionSearchInputField')
  public transactionSearchInputField!: ElementRef<HTMLInputElement>;

  public emitSearchFieldChange(input: string) {
    this.searchFieldChange.emit(input);
  }

  public isSmallTablet: boolean = false;

  public get placeholderText(): string {
    return this.isSmallTablet ? 'Search Trans...' : 'Search Transaction';
  };
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit(): void {
    this.searchTransactionSubscriptions$.add(
      this.screenSizeService.isSmallTablet$.subscribe(
        (isSmallTablet$) => (this.isSmallTablet = isSmallTablet$)
      )
    );
  }

  ngOnDestroy(): void {
    this.searchTransactionSubscriptions$.unsubscribe();
  }
  // #endregion

  public searchFieldInput(): void {
    let value = this.transactionSearchInputField.nativeElement.value;
    this.emitSearchFieldChange(value);
  }
}
