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

@Component({
  selector: 'app-pagination-transactions',
  imports: [CommonModule, IconsComponent],
  templateUrl: './pagination-transactions.component.html',
  styleUrl: './pagination-transactions.component.scss',
})
export class PaginationTransactionsComponent {
  @Input() public currentPage$!: Signal<number>;
  @Input() public totalSubPagesSignal!: Signal<number>; 

  public currentPage = computed(() => this.currentPage$());
  public totalSubPages = computed(() => this.totalSubPagesSignal());

  @Output() public changePage: EventEmitter<number> =
    new EventEmitter<number>();

  public changePageHandler(page: number) {
    this.changePage.emit(page);
  }

  ngOnInit() {
    // setTimeout(() => {
    //   this.changePageHandler(7);
    //   console.log(this.currentPage$());
    // }, 2000);
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.changePageHandler(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < (this.totalSubPages())) {
      this.changePageHandler(this.currentPage() + 1);
    }
  }

  
}
