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
    amount: 86.68,
    budget_id: null,
    created_at: '2025-09-12T00:00:00Z',
    execute_on: '2025-07-26T00:00:00Z',
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

  // the type of the transaction
  public currentTransactionType: string = 'Debit';

  // the value of the pot name input
  public transactionNameValue: string = '';
  // the number of characters left for the pot name
  public transactionsNameCharactersLeft: number = 30;

  // boolean to control the budget dropdown
  public isCategoryDropdownOpen: boolean = false;
  // array of all categories in the application
  public categories: any = [];
  // current chosen category
  public chosenCategory: string = 'General';

  // boolean to control the recurrings dropdown
  public isRecurringDropdownOpen: boolean = false;
  // array of all recurrings in the application
  public recurrings: any = [];
  // current chosen recurring
  public chosenRecurring: string = 'Single Transaction';

  // the value of the pot target input binded by ngModel
  public maxAmountInputValue: string = '0.00';
  // a cached string of the pot target input value
  public maxAmountString: string = '0.00';

  // current date
  public currentDate: string = '';

  public isAmountValid: boolean = true;

  public isNameValid: boolean = true;

  ngOnInit() {
    this.currentTransaction.theme = this.getRandomTheme();
    this.currentDate = this.getCurrentDate();
    console.log(this.currentDate);

    this.getCategoryArray();
    this.getRecurringsArray();
  }

  // ########################################################################

  // switches the transaction type between debit and credit
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

  // controls the maximum amount of the pot target
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

  // add a number to the target input
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

  // delete a number from the target input
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

  // controls the maximum length of the pot name
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

  public getCategoryArray() {
    Object.values(this.baseData.financeApp.budgets.categories).forEach(
      (category: any) => {
        this.categories.push(category.name);
      }
    );
  }

  // choose a category by click from the dropdown
  public chooseCategory(category: string) {
    this.chosenCategory = category;
    let categoryData = category.replace(/\s/g, '');
    categoryData = categoryData[0].toLowerCase() + categoryData.slice(1);
    this.currentTransaction.category = categoryData;
    this.openCloseCategoryDropdown();
  }

  // closes or opens category dropdown
  public openCloseCategoryDropdown() {
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
  }

  // ########################################################################

  // get all the recurrings from the data-store-service
  public getRecurringsArray() {
    Object.values(this.baseData.financeApp.recurrings.types).forEach(
      (type: any) => {
        this.recurrings.push(type);
      }
    );
  }

  // choose a recurring by click from the dropdown
  public chooseRecurring(recurring: any) {
    this.chosenRecurring = recurring.name;
    this.currentTransaction.recurring = recurring.value;
    this.openCloseRecurringDropdown();
  }

  // closes or opens budget dropdown
  public openCloseRecurringDropdown() {
    this.isRecurringDropdownOpen = !this.isRecurringDropdownOpen;
  }

  // ########################################################################

  public getRandomTheme() {
    let themeArray: any = Object.values(this.baseData.financeApp.basics.colors);
    return themeArray[Math.floor(Math.random() * themeArray.length)].hex;
  }

  // ########################################################################

  public getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }

  // ########################################################################

  public validateInputValues() {
    if (this.validateName() && this.validateAmount()) {
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

  // add a new pot to the pots array in data-store-service, submit the new pot to the API and close the modal
  submitAddTransaction() {
    this.currentTransaction.amount = parseFloat(
      this.maxAmountInputValue.replace(/,/g, '')
    );
    this.currentTransaction.name = this.transactionNameValue;

    if (this.validateInputValues()) {
      // this.apiBudgetsService.addNewBudget(this.currentBudget);
      this.mainModalService.hideMainModal();
      console.log(this.currentTransaction);
    }
  }
}
