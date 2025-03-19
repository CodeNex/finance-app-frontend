import { Component, Input, Output, EventEmitter, inject } from '@angular/core';

import { BasedataService } from '../../../../../services/basedata.service';

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

  public baseData: BasedataService = inject(BasedataService);

  public categories: string[] = [];

  public chosenCategory: string = '';

  ngOnInit() {
    this.categories = this.getCategories();
  }

  private getCategories() {
    let array = Object.keys(this.baseData.financeApp.budgets.categories);
    return array;
  }

}
