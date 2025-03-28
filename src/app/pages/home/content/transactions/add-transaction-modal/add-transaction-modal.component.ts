import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsComponent } from '../../../../../components/icons/icons.component';

import { MainModalService } from '../../../../../services/main-modal.service';
import { BasedataService } from '../../../../../services/basedata.service';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { ApiTransactionService } from '../api-transaction.service';

@Component({
  selector: 'app-add-transaction-modal',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconsComponent],
  templateUrl: './add-transaction-modal.component.html',
  styleUrl: './add-transaction-modal.component.scss',
})
export class AddTransactionModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public baseData: BasedataService = inject(BasedataService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public apiTransactionsService: ApiTransactionService = inject(
    ApiTransactionService
  );

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  public currentTransaction: any = {
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

  ngOnInit() {
    this.currentTransaction.theme = this.getRandomTheme();
    this.currentDate = this.getCurrentDate();
    console.log(this.currentDate);

    this.getCategoryArray();
    this.getRecurringsArray();
  }

  // ########################################################################
  // DEBIT and CREDIT choose functions
  // ########################################################################

  public currentTransactionType: string = 'Debit';

  public setTransactionType(type: string) {
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

  // ########################################################################
  // AMOUNT Input functions
  // ########################################################################

  public maxAmountInputValue: string = '0.00'; // ngModel binded
  public maxAmountString: string = '0.00';

  controlMaxTarget(event: any) {
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

  addNumberToTargetInput(event: any) {
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

  deleteNumberFromTargetInput() {
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

  // ########################################################################
  // NAME Input functions
  // ########################################################################

  public transactionNameValue: string = ''; // ngModel binded
  public transactionsNameCharactersLeft: number = 30;

  controlNameLength(event: any) {
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

  // ########################################################################
  // CATEGORY Dropdown functions
  // ########################################################################

  public categories: any = [];
  public chosenCategory: string = 'General';
  public isCategoryDropdownOpen: boolean = false;

  public getCategoryArray() {
    Object.values(this.baseData.financeApp.budgets.categories).forEach(
      (category: any) => {
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

  // ########################################################################
  // RECURRING Dropdown functions
  // ########################################################################

  public recurrings: any = [];
  public chosenRecurring: string = 'Single Transaction';
  public isRecurringDropdownOpen: boolean = false;

  public getRecurringsArray() {
    Object.values(this.baseData.financeApp.recurrings.types).forEach(
      (type: any) => {
        this.recurrings.push(type);
      }
    );
  }

  public chooseRecurring(recurring: any) {
    this.chosenRecurring = recurring.name;
    this.currentTransaction.recurring = recurring.value;
    this.openCloseRecurringDropdown();
  }

  public openCloseRecurringDropdown() {
    this.isRecurringDropdownOpen = !this.isRecurringDropdownOpen;
  }

  // ########################################################################
  // DATE Input functions
  // ########################################################################

  public currentDate: string = ''; // html - min attribute
  public chosenDateValue: string = ''; // ngModel binded

  public getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }

  private getChosenDate() {
    if (this.chosenDateValue.length === 0) {
      return null;
    } else if (this.chosenDateValue.length > 0) {
      return new Date(this.chosenDateValue).toISOString();
    }
  }

  // ########################################################################
  // Get a random theme color for the transaction
  // ########################################################################

  public getRandomTheme() {
    let themeArray: any = Object.values(this.baseData.financeApp.basics.colors);
    return themeArray[Math.floor(Math.random() * themeArray.length)].hex;
  }

  // ########################################################################
  // functions to validate the input values
  // ########################################################################

  public isAmountValid: boolean = true; // ngStyle binded
  public isNameValid: boolean = true; // ngStyle binded

  public validateInputValues() {
    let isAmountValid = this.validateAmount();
    let isNameValid = this.validateName();
    if (isAmountValid && isNameValid) {
      return true;
    } else {
      return false;
    }
  }

  public validateAmount() {
    if (this.currentTransaction.amount <= 0) {
      this.isAmountValid = false;
      return false;
    } else {
      this.isAmountValid = true;
      return true;
    }
  }

  public validateName() {
    if (this.currentTransaction.name.length === 0) {
      this.isNameValid = false;
      return false;
    } else {
      this.isNameValid = true;
      return true;
    }
  }

  public resetValidation(input: string) {
    if (input === 'amount') this.isAmountValid = true;
    if (input === 'name') this.isNameValid = true;
  }

  // ########################################################################
  // complete and submit new transaction to "api-transaction.service"
  // ########################################################################

  private completeNewTransaction() {
    
  }

  public submitAddTransaction() {
    this.currentTransaction.amount = parseFloat(
      this.maxAmountInputValue.replace(/,/g, '')
    );
    this.currentTransaction.name = this.transactionNameValue;
    this.currentTransaction.execute_on = this.chosenDateValue;

    if (this.validateInputValues()) {
      // this.apiBudgetsService.addNewBudget(this.currentBudget);
      this.mainModalService.hideMainModal();
      console.log(this.currentTransaction);
    }
  }
}
