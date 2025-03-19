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

  // array of all categories in the application
  public categories: string[] = [];
  // current chosen category
  public chosenCategory: string = 'All Transactions';

  ngOnInit() {
    this.categories = this.getCategories();
  }

  private getCategories() {
    let arrayCache = Object.values(this.baseData.financeApp.budgets.categories);
    let array = arrayCache.map((element: any) => element.name);
    array.unshift('All Transactions');
    return array;
  }

}
