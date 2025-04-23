import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IconsComponent } from '@components/icons/icons.component';

import { MainModalService } from '@services/main-modal.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiBudgetsService } from '@content/budgets/api-budgets.service';
import { FormatAmountInputService } from '@src/services/format-amount-input.service';


/**
 * * * AddBudgetModalComponent
 * This component is responsible for displaying the add budget modal.
 * It allows the user to add a new budget with a name, amount, and theme.
 * It uses the MainModalService to manage the modal state and the ApiBudgetsService to interact with the backend.
 */
@Component({
  selector: 'app-add-budget-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-budget-modal.component.html',
  styleUrl: './add-budget-modal.component.scss',
})
export class AddBudgetModalComponent implements OnInit {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public baseData = inject(BasedataService);
  public dataStore = inject(DataStoreServiceService);
  public apiBudgetsService = inject(ApiBudgetsService);
  public formatAmountInputService = inject(FormatAmountInputService);

  public currentBudget: BudgetsObject = {
    id: -1,
    name: '',
    amount: 0,
    maximum: -1,
    theme: '',
    time_frame: '',
    deleted_at: null,
    created_at: null,
    last_spendings: null,
  };
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit(): void {
    this.initialzeAddBudgetModal();
  }

  private initialzeAddBudgetModal(): void {
    this.getThemeArrays();
    this.getCategoryArrays();
    this.chosenTheme = this.getInitialTheme();
    this.chosenCategory = this.getInitialCategory();
    this.currentBudget.theme = this.chosenTheme.hex;
    this.currentBudget.name = this.chosenCategory;
  }
  // #endregion

  // #region Dropdowns & Modal
  public isBudgetDropdownOpen: boolean = false;
  public isThemeDropdownOpen: boolean = false;

  public toggleBudgetDropdown(): void {
    this.isBudgetDropdownOpen = !this.isBudgetDropdownOpen;
  }

  public toggleThemeDropdown(): void {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
  }

  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
  // #endregion

  // #region Categories
  public categories: string[] = [];
  public usedBudgetCategories: string[] = [];
  public unusedBudgetCategories: string[] = [];
  public chosenCategory: string = '';

  /**
   * * @description - This function is used to get the categories from the base data.
   * * @returns - The categories in the format of { name: string, iconName: string }[]
   */
  public getCategoryArrays(): void {
    (
      Object.values(this.baseData.financeApp.budgets.categories) as {
        name: string;
        iconName: string;
      }[]
    ).forEach((category) => {
      this.categories.push(category.name);
    });
    if (Array.isArray(this.dataStore.budgets())) {
      this.usedBudgetCategories = (
        this.dataStore.budgets() as BudgetsObjectLike[]
      ).map((budget) => {
        if (!budget.deleted_at) return budget.name;
        return;
      }) as string[];
    }
    this.unusedBudgetCategories = this.categories.filter(
      (category: string) => !this.usedBudgetCategories.includes(category)
    );
  }

  /**
   * @description - This function is used to get the initial category for the budget.
   * @returns - A random category from the unusedBudgetCategories array.
   */
  private getInitialCategory(): string {
    return this.unusedBudgetCategories[
      Math.floor(Math.random() * this.unusedBudgetCategories.length)
    ];
  }

  /**
   * @description - This function is used to choose a category from the dropdown.
   * @param category - The category to be chosen.
   */
  public chooseCategory(category: string): void {
    if (this.unusedBudgetCategories.includes(category)) {
      this.chosenCategory = category;
      this.currentBudget.name = this.chosenCategory;
      this.toggleBudgetDropdown();
    }
  }
  // #endregion

  // #region Target Input
  public amountInputValue: string = '0.00';

  /**
   * @description - This function is used to format the amount input value.
   * @param event - The event that is triggered when the user types in the input field.
   */
  public controlMaxTarget(event: KeyboardEvent) {
    const inputValue = this.amountInputValue;
    this.amountInputValue = this.formatAmountInputService.formatAmountInput(event, inputValue);
  }
  // #endregion

  // #region Themes
  public themes: { name: string; hex: string }[] = [];
  public usedBudgetThemes: string[] = [];
  public unusedBudgetThemes: { name: string; hex: string }[] = [];
  public chosenTheme: { name: string; hex: string } = { name: '', hex: '' };
  public potThemeValue: string = '';

  /**
   * * @description - This function is used to get the themes from the base data.
   * * @returns - The themes in the format of { name: string, hex: string }[]
   */
  private getThemeArrays(): void {
    this.themes = Object.values(this.baseData.financeApp.basics.colors);
    this.usedBudgetThemes = this.dataStore.budgets().map((budget: any) => {
      if (!budget.deleted_at) return budget.theme;
    });
    this.unusedBudgetThemes = this.themes.filter((theme: any) => {
      if (theme && !this.usedBudgetThemes.includes(theme.hex)) {
        return theme;
      }
    });
  }

  /**
   * @description - This function is used to choose a theme from the dropdown.
   * @returns - A random theme from the unusedBudgetThemes array.
   */
  private getInitialTheme(): { name: string; hex: string } {
    return this.unusedBudgetThemes[
      Math.floor(Math.random() * this.unusedBudgetThemes.length)
    ];
  }

  /**
   * @description - This function is used to choose a theme from the dropdown.
   * @param theme - The theme to be chosen.
   */
  public chooseTheme(theme: any): void {
    if (this.unusedBudgetThemes.includes(theme)) {
      this.chosenTheme = theme;
      this.toggleThemeDropdown();
    }
  }
  // #endregion

  /**
   * * submitEditedBudget
   * This function is called when the user clicks the save button in the modal.
   */
  submitAddBudget() {
    this.currentBudget.maximum = parseFloat(
      this.amountInputValue.replace(/,/g, '')
    );
    this.currentBudget.theme = this.chosenTheme.hex;
    this.currentBudget.time_frame = 'year';
    this.apiBudgetsService.addNewBudget(this.currentBudget);
    this.mainModalService.hideMainModal();
  }
}
