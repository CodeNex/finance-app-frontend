import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, Output, EventEmitter, inject } from '@angular/core';
import { IconsComponent } from '@components/icons/icons.component';

import { ScreensizeService } from '@src/services/screensize.service';
import { Observable } from 'rxjs';

/**
 * * * * SortbyTransactionsComponent
 * This component is responsible for displaying the sort by dropdown menu for transactions.
 * It allows the user to choose how to sort the transactions in the application.
 * * It uses the CommonModule for common Angular directives and the IconsComponent for displaying icons.
 * * It emits an event when the user selects a sort option.
 */
@Component({
  selector: 'app-sortby-transactions',
  imports: [CommonModule, IconsComponent, AsyncPipe],
  templateUrl: './sortby-transactions.component.html',
  styleUrl: './sortby-transactions.component.scss',
})
export class SortbyTransactionsComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private screenSizeService = inject(ScreensizeService);
  public isHandset: Observable<boolean> = this.screenSizeService.isHandset$;

  @Output() public sortByChange: EventEmitter<string> =
    new EventEmitter<string>();

  public sortByOptions: string[] = [
    'Latest',
    'Oldest',
    'A to Z',
    'Z to A',
    'Highest',
    'Lowest',
  ];

  public chosenSortBy: string = 'Latest';
  public isDropDownOpen: boolean = false;
  // #endregion

  public chooseSortBy(sortBy: string): void {
    this.chosenSortBy = sortBy;
    this.emitSortByChange(sortBy);
    this.toggleDropdown();
  }

  private emitSortByChange(sortBy: string): void {
    this.sortByChange.emit(sortBy);
  }

  public toggleDropdown(): void {
    this.isDropDownOpen = !this.isDropDownOpen;
  }
}
