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
  public categories: any[] = [];
  // current chosen category
  public chosenCategory: string = 'All Transactions';

  ngOnInit() {
    this.categories = this.getCategories();
  }

  private getCategories() {
    let array = Object.values(this.baseData.financeApp.budgets.categories);
    array.unshift({name: 'All Transactions', iconName: 'All Transactions'});
    return array;
  }

  public changeCategoryFilter(category: any) {
    this.chosenCategory = category.name;
    this.emitCategoryFilterChange(category.iconName);
  }

}
