import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconsComponent } from '@components/icons/icons.component';

import { MainModalService } from '@services/main-modal.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiBudgetsService } from '@content/budgets/api-budgets.service';
import { CommonModule } from '@angular/common';

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
export class AddBudgetModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public baseData = inject(BasedataService);
  public dataStore = inject(DataStoreServiceService);
  public apiBudgetsService = inject(ApiBudgetsService);

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

  // #region Lifecycle
  ngOnInit() {
    this.getThemeArrays();
    this.getCategoryArrays();
    this.chosenTheme = this.getInitialTheme();
    this.currentBudget.theme = this.chosenTheme.hex;
    this.chosenCategory = this.getInitialCategory();
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

  public getCategoryArrays():void {
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

  private getInitialCategory(): string {
    return this.unusedBudgetCategories[
      Math.floor(Math.random() * this.unusedBudgetCategories.length)
    ];
  }

  public chooseCategory(category: string): void {
    if (this.unusedBudgetCategories.includes(category)) {
      this.chosenCategory = category;
      this.currentBudget.name = this.chosenCategory;
      this.toggleBudgetDropdown();
    }
  }
  // #endregion

  // #region Target Input
  public maxBudgetInputValue: string = '0.00';
  public maxBudgetString: string = '0.00';

  public controlMaxTarget(event: KeyboardEvent): void {
    const deleteKeys = ['Backspace', 'Delete'];
    const otherKeys = ['ArrowLeft', 'ArrowRight', 'Tab'];
    const isNumberKey = /^[0-9]$/.test(event.key);

    if (isNumberKey) {
      event.preventDefault();
      this.addNumberToTargetInput(event);
    } else if (deleteKeys.includes(event.key)) {
      event.preventDefault();
      this.deleteNumberFromTargetInput();
    } else if (otherKeys.includes(event.key)) {
      return;
    } else {
      event.preventDefault();
      return;
    }
  }

  private formatToEnUS(value: number): string {
    if (value == null) return '';
    return `${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  addNumberToTargetInput(event: KeyboardEvent) {
    let currentTarget = this.maxBudgetString;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    if (numbersArray.length === 3 && numbersArray[0] === '0') {
      numbersArray.shift();
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.maxBudgetString = this.formatToEnUS(
        parseFloat(numbersArray.join('')) || 0
      );
      this.maxBudgetInputValue = this.maxBudgetString;
    } else if (
      numbersArray.length >= 3 &&
      numbersArray.length < 11 &&
      numbersArray[0] !== '0'
    ) {
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.maxBudgetString = this.formatToEnUS(
        parseFloat(numbersArray.join('')) || 0
      );
      this.maxBudgetInputValue = this.maxBudgetString;
    }
  }

  deleteNumberFromTargetInput() {
    let currentTarget = this.maxBudgetString;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    numbersArray.pop();
    numbersArray.splice(numbersArray.length - 2, 0, '.');
    this.maxBudgetString = this.formatToEnUS(
      parseFloat(numbersArray.join('')) || 0
    );
    this.maxBudgetInputValue = this.maxBudgetString;
  }
  // #endregion

  // #region Themes
  public themes: { name: string; hex: string }[] = [];
  public usedBudgetThemes: string[] = [];
  public unusedBudgetThemes: { name: string; hex: string }[] = [];
  public chosenTheme: { name: string; hex: string } = { name: '', hex: '' };
  public potThemeValue: string = '';

  private getThemeArrays(): void {
    this.themes = Object.values(this.baseData.financeApp.basics.colors);
    this.usedBudgetThemes = this.dataStore.budgets().map((budget: any) => {
      if (!budget.deleted_at) return budget.theme;
    });
    this.unusedBudgetThemes = this.themes.map((theme: any) => {
      if (!this.usedBudgetThemes.includes(theme.hex)) {
        return theme;
      }
    });
  }

  private getInitialTheme(): { name: string; hex: string } {
    return this.unusedBudgetThemes[
      Math.floor(Math.random() * this.unusedBudgetThemes.length)
    ];
  }

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
      this.maxBudgetInputValue.replace(/,/g, '')
    );
    this.currentBudget.theme = this.chosenTheme.hex;
    this.currentBudget.time_frame = 'year';
    this.apiBudgetsService.addNewBudget(this.currentBudget);
    this.mainModalService.hideMainModal();
  }
}
