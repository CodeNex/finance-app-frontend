import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsComponent } from '@components/icons/icons.component';

import { MainModalService } from '@services/main-modal.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiTransactionService } from '@content/transactions/api-transaction.service';
import { FormatAmountInputService } from '@src/services/format-amount-input.service';

@Component({
  selector: 'app-add-transaction-modal',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconsComponent],
  templateUrl: './add-transaction-modal.component.html',
  styleUrl: './add-transaction-modal.component.scss',
})
export class AddTransactionModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public baseData = inject(BasedataService);
  public dataStore = inject(DataStoreServiceService);
  public apiTransactionsService = inject(ApiTransactionService);
  public formatAmountInputService = inject(FormatAmountInputService);

  public currentTransaction: TransactionsObject = {
    transaction_id: 0,
    user_id: 0,
    amount: 0,
    budget_id: null,
    created_at: null,
    execute_on: null,
    deleted_at: null,
    recurring: null,
    recurring_id: null,
    theme: '',
    sender: '',
    receiver: '',
    name: '',
    category: 'general',
    type: 'debit',
  };
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit() {
    this.getCategoryArray();
    this.getRecurringsArray();
    this.currentDate = this.getCurrentDate();
    this.chosenDateValue = this.getCurrentDate();
  }
  // #endregion

  // #region Helper functions
  public closeMainModal(): void {
    this.mainModalService.hideMainModal();
  }

  private getRandomTheme(): string {
    let themeArray: any = Object.values(this.baseData.financeApp.basics.colors);
    return themeArray[Math.floor(Math.random() * themeArray.length)].hex;
  }
  // #endregion

  // #region DEBIT and CREDIT choose functions
  public currentTransactionType: string = 'Debit';

  public setTransactionType(type: string): void {
    if (this.currentTransactionType === type) {
      return;
    } else {
      if (type === 'Debit') {
        this.currentTransactionType = 'Debit';
        this.currentTransaction.type = 'debit';
      } else {
        this.currentTransactionType = 'Credit';
        this.currentTransaction.type = 'credit';
      }
    }
  }
  // #endregion

  public maxAmountInputValue: string = '0.00'; // ngModel binded
  public maxAmountString: string = '0.00';

  public controlMaxTarget(event: any) {
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

  public addNumberToTargetInput(event: any) {
    let currentTarget = this.maxAmountString;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    if (numbersArray.length === 3 && numbersArray[0] === '0') {
      numbersArray.shift();
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.maxAmountString = parseFloat(numbersArray.join('')).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
        }
      );
      this.maxAmountInputValue = this.maxAmountString;
    } else if (
      numbersArray.length >= 3 &&
      numbersArray.length < 11 &&
      numbersArray[0] !== '0'
    ) {
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.maxAmountString = parseFloat(numbersArray.join('')).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
        }
      );
      this.maxAmountInputValue = this.maxAmountString;
    }
  }

  public deleteNumberFromTargetInput() {
    let currentTarget = this.maxAmountString;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    numbersArray.pop();
    numbersArray.splice(numbersArray.length - 2, 0, '.');
    this.maxAmountString = parseFloat(numbersArray.join('')).toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
      }
    );
    this.maxAmountInputValue = this.maxAmountString;
  }

  private getAmountValue(): number {
    return parseFloat(this.maxAmountInputValue.replace(/,/g, ''));
  }

  // #region Transaction Name functions
  public transactionNameValue: string = ''; // ngModel binded
  public transactionsNameCharactersLeft: number = 30;

  public controlNameLength(event: any) {
    const deleteKeys = ['Backspace', 'Delete'];
    if (deleteKeys.includes(event.key)) {
      if (this.transactionsNameCharactersLeft < 30)
        this.transactionsNameCharactersLeft =
          30 - (this.transactionNameValue.length - 1);
      return;
    } else if (this.transactionNameValue.length >= 30) {
      event.preventDefault();
    } else {
      setTimeout(() => {
        this.transactionsNameCharactersLeft =
          30 - this.transactionNameValue.length;
      }, 1);
    }
  }

  private getNameValue() {
    return this.transactionNameValue;
  }
  // #endregion

  // #region Category Dropdown functions
  public categories: string[] = [];
  public chosenCategory: string = 'General'; // interpolation {{chosenCategory}}
  public isCategoryDropdownOpen: boolean = false;

  public getCategoryArray() {
    console.log(Object.values(this.baseData.categories));

    Object.values(this.baseData.categories as Category[]).forEach(
      (category: Category) => {
        this.categories.push(category.name);
      }
    );
  }

  public chooseCategory(category: string) {
    this.chosenCategory = category;
    let categoryData = category.replace(/\s/g, '');
    categoryData = categoryData[0].toLowerCase() + categoryData.slice(1);
    this.currentTransaction.category = categoryData;
    this.openCloseCategoryDropdown();
  }

  public openCloseCategoryDropdown() {
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
  }
  // #endregion

  /**
   * RECURRING Dropdown functions
   */

  public recurrings: any = [];
  public chosenRecurring: string = 'Single Transaction'; // interpolation {{chosenRecurring}}
  public isRecurringDropdownOpen: boolean = false;

  public getRecurringsArray() {
    Object.values(this.baseData.financeApp.recurrings.types).forEach(
      (type: any) => {
        this.recurrings.push(type);
      }
    );
  }

  public openCloseRecurringDropdown() {
    this.isRecurringDropdownOpen = !this.isRecurringDropdownOpen;
  }

  public chooseRecurring(recurring: any) {
    this.chosenRecurring = recurring.name;
    this.currentTransaction.recurring = recurring.value;
    this.openCloseRecurringDropdown();
  }

  // #region Date functions
  public currentDate: string = ''; // html - min attribute
  public chosenDateValue: string = ''; // ngModel binded

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getChosenDate(): null | string {
    if (this.chosenDateValue.length === 0) {
      return null;
    } else {
      return new Date(this.chosenDateValue).toISOString();
    }
  }
  // #endregion

  // #region Validation functions
  public isAmountValid: boolean = true; // ngStyle binded
  public isNameValid: boolean = true; // ngStyle binded

  /**
   * @description - This function is used to validate the input values of the transaction.
   * @returns boolean - true if all inputs are valid, false otherwise
   */
  public validateInputValues(): boolean {
    let isAmountValid = this.validateAmount();
    let isNameValid = this.validateName();
    if (isAmountValid && isNameValid) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @description - This function is used to validate the amount input value.
   * @returns boolean - true if the amount is valid, false otherwise
   */
  public validateAmount(): boolean | undefined {
    if (!this.currentTransaction.amount) return;
    if (this.currentTransaction.amount <= 0) {
      this.isAmountValid = false;
      return false;
    } else {
      this.isAmountValid = true;
      return true;
    }
  }

  /**
   * @description - This function is used to validate the name input value.
   * @returns boolean - true if the name is valid, false otherwise
   */
  public validateName(): boolean {
    if (this.currentTransaction.name.length === 0) {
      this.isNameValid = false;
      return false;
    } else {
      this.isNameValid = true;
      return true;
    }
  }

  /**
   * @description - This function is used to reset the validation state of the input fields.
   * @param input - The name of the input field to reset (amount or name)
   */
  public resetValidation(input: string): void {
    if (input === 'amount') this.isAmountValid = true;
    if (input === 'name') this.isNameValid = true;
  }
  // #endregion

  // #region Submit functions
  /**
   * @description - This function is used to complete the new transaction object.
   */
  private completeNewTransaction(): void {
    this.currentTransaction.amount = this.getAmountValue();
    this.currentTransaction.name = this.getNameValue();
    this.currentTransaction.execute_on = this.getChosenDate();
    this.currentTransaction.theme = this.getRandomTheme();
  }

  /**
   * @description - This function is used to submit the new transaction object.
   * It first completes the new transaction object and then validates the input values.
   * If the input values are valid, it starts the transaction and hides the modal.
   */
  public submitAddTransaction(): void {
    this.completeNewTransaction();
    if (this.validateInputValues()) {
      this.apiTransactionsService.startTransactionFromTransactions(
        this.currentTransaction,
        'transactions'
      );
      this.mainModalService.hideMainModal();
    }
  }
  // #endregion
}
