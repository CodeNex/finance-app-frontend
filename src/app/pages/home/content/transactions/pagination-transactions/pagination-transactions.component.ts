import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Signal,
  computed,
  Output,
  EventEmitter,
} from '@angular/core';
import { IconsComponent } from '@components/icons/icons.component';

/**
 * * * PaginationTransactionsComponent
 * * This component is responsible for displaying the pagination for transactions.
 * * It allows the user to navigate through the pages of transactions.
 * * It uses the Signal API to manage the state of the current page and total subpages.
 */
@Component({
  selector: 'app-pagination-transactions',
  imports: [CommonModule, IconsComponent],
  templateUrl: './pagination-transactions.component.html',
  styleUrl: './pagination-transactions.component.scss',
})
export class PaginationTransactionsComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  @Input() public currentPageSignal!: Signal<number>;
  @Input() public totalSubPagesSignal!: Signal<number>;

  public currentPage = computed(() => this.currentPageSignal());
  public totalSubPages = computed(() => this.totalSubPagesSignal());

  @Output() public changePage: EventEmitter<number> =
    new EventEmitter<number>();

  private changePageHandler(page: number): void {
    this.changePage.emit(page);
  }
  // #endregion

  public prevPage(): void {
    if (this.currentPage() > 0) {
      this.changePageHandler(this.currentPage() - 1);
    }
  }

  public nextPage(): void {
    if (this.currentPage() < this.totalSubPages()) {
      this.changePageHandler(this.currentPage() + 1);
    }
  }
}
