import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';

import { BasedataService } from '@services/basedata.service';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '@components/icons/icons.component';

@Component({
  selector: 'app-categoryfilter-transactions',
  imports: [CommonModule, IconsComponent],
  templateUrl: './categoryfilter-transactions.component.html',
  styleUrl: './categoryfilter-transactions.component.scss',
})
export class CategoryfilterTransactionsComponent implements OnInit {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public baseData = inject(BasedataService);

  @Output() public categoryFilterChange: EventEmitter<string> =
    new EventEmitter<string>();

  public emitCategoryFilterChange(category: string) {
    this.categoryFilterChange.emit(category);
  }

  public categories: Category[] = [];
  public chosenCategory: string = 'All Transactions';
  public isDropDownOpen: boolean = false;
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit() {
    this.categories = this.getCategories();
  }
  // #endregion

  // #region Helper Function
  public closeHideDropdown(): void {
    this.isDropDownOpen = !this.isDropDownOpen;
  }
  // #endregion

  // #region Category Filter Functions
  /**
   * @description - This function is responsible for getting the categories from the base data.
   * @returns - Returns an array of categories with the first element being 'All Transactions'.
   */
  private getCategories(): Category[] {
    let array: Category[] = Object.values(this.baseData.categories);
    array.unshift({ name: 'All Transactions', iconName: 'All Transactions' });
    return array;
  }

  /**
   * @description - This function is responsible for getting the initial category.
   * @param category - The category object that is passed to the function.
   */
  public chooseCategory(category: Category): void {
    this.chosenCategory = category.name;
    this.emitCategoryFilterChange(category.iconName);
    this.closeHideDropdown();
  }
  // #endregion
}
