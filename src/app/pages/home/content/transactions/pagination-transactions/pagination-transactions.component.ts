import { Component, Input, Signal, computed, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination-transactions',
  imports: [],
  templateUrl: './pagination-transactions.component.html',
  styleUrl: './pagination-transactions.component.scss'
})
export class PaginationTransactionsComponent {

  @Input() public currentPage$!: Signal<number>; 

  public currentPage = computed(() => this.currentPage$());

  @Output() public changePage: EventEmitter<number> = new EventEmitter<number>();

  public changePageHandler(page: number) {
    this.changePage.emit(page);
  }

  ngOnInit() {
    console.log(this.currentPage());
  }
}
