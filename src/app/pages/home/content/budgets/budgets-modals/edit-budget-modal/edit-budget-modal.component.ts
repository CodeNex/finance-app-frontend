import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainModalService } from '@services/main-modal.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiBudgetsService } from '@content/budgets/api-budgets.service';
import { FormatAmountInputService } from '@src/services/format-amount-input.service';

import { IconsComponent } from '@components/icons/icons.component';

/**
 * * EditBudgetModalComponent
 * This component is responsible for displaying the edit budget modal.
 * It allows the user to edit the budget name, amount, and theme.
 * It uses the MainModalService to manage the modal state and the ApiBudgetsService to interact with the backend.
 */
@Component({
  selector: 'app-edit-budget-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './edit-budget-modal.component.html',
  styleUrl: './edit-budget-modal.component.scss',
})
export class EditBudgetModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public apiBudgetsService = inject(ApiBudgetsService);
  public baseData = inject(BasedataService);
  public dataStore = inject(DataStoreServiceService);
  public formatAmountInputService = inject(FormatAmountInputService);

  @Input() public budgetIndex: number = 1;
  @Input() public modalObject: BudgetsObject = {
    id: -1,
    name: '',
    amount: -1,
    maximum: -1,
    theme: '',
    time_frame: '',
    deleted_at: null,
    created_at: null,
    last_spendings: [
      {
        transaction_id: -1,
        user_id: -1,
        name: '',
        amount: -1,
        recurring: null,
        recurring_id: null,
        theme: '',
        budget_id: null,
        deleted_at: null,
        created_at: null,
        category: '',
        execute_on: null,
        sender: null,
        receiver: null,
        type: 'credit',
      },
    ],
  };

  public currentBudgetIndex: number = -1;
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit(): void {
    this.currentBudgetIndex = this.budgetIndex;
    this.getCategoryArrays();
    this.getThemeArrays();
    this.amountInputValue = this.formatToEnUS(this.modalObject.maximum);
    this.chosenCategory = this.modalObject.name;
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
   * @description - This function is used to get the categories from the base data and filter out the used categories.
   */
  getCategoryArrays() {
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
   * @param category - The category to be chosen.
   */
  chooseCategory(category: string): void {
    if (this.unusedBudgetCategories.includes(category)) {
      this.chosenCategory = category;
      this.modalObject.name = this.chosenCategory;
      this.toggleBudgetDropdown();
    }
  }
  // #endregion

  // #region Target Input
  public amountInputValue: string = '0.00';

  public controlMaxTarget(event: KeyboardEvent) {
    const inputValue = this.amountInputValue;
    this.amountInputValue = this.formatAmountInputService.formatAmountInput(event, inputValue);
  }

  /**
   * @description - This function is used to format the input value to the en-US format.
   * @param value - The value to be formatted.
   * @returns - The formatted value in the en-US format. 
   */
  private formatToEnUS(value: number): string {
    if (value == null) return '';
    return `${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  // #endregion

  // #region Themes
  public themes: { name: string; hex: string }[] = [];
  public usedBudgetThemes: string[] = [];
  public unusedBudgetThemes: string[] = [];
  public chosenTheme: { name: string; hex: string } = { name: '', hex: '' };
  public potThemeValue: string = '';

  /**
   * * @description - This function is used to get the themes from the base data and filter out the used themes.
   * * @returns - The themes in the format of { name: string, hex: string }[]
   */
  getThemeArrays() {
    this.themes = Object.values(this.baseData.financeApp.basics.colors);
    this.usedBudgetThemes = this.dataStore.budgets().map((budget: any) => {
      if (!budget.deleted_at) return budget.theme;
    });
    this.unusedBudgetThemes = this.themes.map((theme: any) => {
      if (!this.usedBudgetThemes.includes(theme.hex)) {
        return theme.hex;
      }
    });
    this.chosenTheme = this.themes.find(
      (theme: { name: string; hex: string }) => {
        return theme.hex === this.modalObject.theme;
      }
    ) || { name: '', hex: '' };
  }

  /**
   * @description - This function is used to choose a theme from the dropdown.
   * @param theme - The theme to be chosen.
   */
  public chooseTheme(theme: { name: string; hex: string }): void {
    if (this.unusedBudgetThemes.includes(theme.hex)) {
      this.chosenTheme = theme;
      this.toggleThemeDropdown();
    }
  }
  // #endregion

  /**
   * * submitEditedBudget
   * This function is called when the user clicks the save button in the modal.
   */
  submitEditedBudget() {
    this.modalObject.maximum = parseFloat(
      this.amountInputValue.replace(/,/g, '')
    );
    this.modalObject.theme = this.chosenTheme.hex;
    this.modalObject.time_frame = 'year';
    this.apiBudgetsService.updateBudget(
      'budgets',
      'editBudget',
      this.currentBudgetIndex,
      this.modalObject
    );
    this.mainModalService.hideMainModal();
    console.log(this.modalObject);
  }
}
