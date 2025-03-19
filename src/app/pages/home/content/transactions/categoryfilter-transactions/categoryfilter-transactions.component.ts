import { Component, Input, Output, EventEmitter, inject } from '@angular/core';

import { BasedataService } from '../../../../../services/basedata.service';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '../../../../../components/icons/icons.component';

@Component({
  selector: 'app-categoryfilter-transactions',
  imports: [CommonModule, IconsComponent],
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
  // boolean to control the dropdown
  public isDropDownOpen: boolean = false;

  ngOnInit() {
    this.categories = this.getCategories();
  }

  private getCategories() {
    let array = Object.values(this.baseData.financeApp.budgets.categories);
    array.unshift({name: 'All Transactions', iconName: 'All Transactions'});
    return array;
  }

  public closeHideDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  public chooseCategory(category: any) {
    this.chosenCategory = category.name;
    this.emitCategoryFilterChange(category.iconName);
    this.closeHideDropdown();
  }

}
