import {
  Component,
  Input,
  Signal,
  computed,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-pagination-transactions',
  imports: [],
  templateUrl: './pagination-transactions.component.html',
  styleUrl: './pagination-transactions.component.scss',
})
export class PaginationTransactionsComponent {
  @Input() public currentPage$!: Signal<number>;
  @Input() public totalSubPages$!: Signal<number>; 

  public currentPage = computed(() => this.currentPage$());
  public totalSubPages = computed(() => this.totalSubPages$());

  @Output() public changePage: EventEmitter<number> =
    new EventEmitter<number>();

  public changePageHandler(page: number) {
    this.changePage.emit(page);
  }

  ngOnInit() {
    setTimeout(() => {
      this.changePageHandler(7);
      console.log(this.currentPage$());
    }, 3000);
  }
}
