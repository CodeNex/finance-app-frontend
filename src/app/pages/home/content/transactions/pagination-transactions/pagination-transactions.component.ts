import { Component, Input, Signal, computed } from '@angular/core';

@Component({
  selector: 'app-pagination-transactions',
  imports: [],
  templateUrl: './pagination-transactions.component.html',
  styleUrl: './pagination-transactions.component.scss'
})
export class PaginationTransactionsComponent {

  @Input() public currentPage$!: Signal<number>; 

  public currentPage = computed(() => this.currentPage$());

  ngOnInit() {
    console.log(this.currentPage());
  }
}
