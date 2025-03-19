import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-categoryfilter-transactions',
  imports: [],
  templateUrl: './categoryfilter-transactions.component.html',
  styleUrl: './categoryfilter-transactions.component.scss'
})
export class CategoryfilterTransactionsComponent {

  @Output() public categoryFilterChange: EventEmitter<string> = new EventEmitter<string>();

  public emitCategoryFilterChange(category: string) {
    this.categoryFilterChange.emit(category);
  }

  ngOnInit() {
    // setTimeout(() => {
    //   this.emitCategoryFilterChange('transportation');
    // }, 2000);
  }

}
