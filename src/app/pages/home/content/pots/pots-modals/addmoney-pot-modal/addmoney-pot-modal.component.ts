import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainModalService } from '@services/main-modal.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiPotsService } from '@content/pots/api-pots.service';
import { ApiTransactionService } from '@content/transactions/api-transaction.service';

/**
 * * * AddmoneyPotModalComponent
 * * This component is responsible for displaying the add money pot modal.
 * * It allows the user to add money to an existing pot.
 * * It uses the MainModalService to manage the modal state and the ApiPotsService to interact with the backend.
 * * It also uses the ApiTransactionService to handle transactions related to the pot.
 */
@Component({
  selector: 'app-addmoney-pot-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './addmoney-pot-modal.component.html',
  styleUrl: './addmoney-pot-modal.component.scss',
})
export class AddmoneyPotModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public dataStore = inject(DataStoreServiceService);
  public apiPotService = inject(ApiPotsService);
  public apiTransactionService = inject(ApiTransactionService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  @Input() public modalObject!: PotsObject;
  @Input() public potIndex: number = -1;

  public currentPot: PotsObject = {
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    created_at: null,
    deleted_at: null,
  };

  public currentPotIndex: number = -1;
  // #endregion
  
  // #region Lifecycle Hooks
  ngOnInit() {
    this.currentPot = this.modalObject;
    this.currentPotIndex = this.potIndex;
    this.newAmount = this.currentPot.total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    });
    this.targetAmount = this.currentPot.target.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
    this.percentageNumber =
      Math.trunc((this.currentPot.total / this.currentPot.target) * 1000) / 10;
    this.percentage = (
      Math.trunc((this.currentPot.total / this.currentPot.target) * 1000) / 10
    ).toFixed(1);
    this.progressBarPercentage =
      (
        Math.trunc((this.currentPot.total / this.currentPot.target) * 1000) / 10
      ).toFixed(0) + '%';
  }
  // #endregion

  // #region Input Control
  public newAmount: string = '';
  public targetAmount: string = '';
  public inputValue: string = '0.00'; // ngModel binded to the input field
  public inputValueCache: string = '0.00';

  /**
   * @description - This function is used to control the input value of the money input field.
   * It formats the input value and updates the percentage bar based on the input value.
   * @param event - The event that is triggered when the user types in the input field.
   */
  controlMoneyInput(event: any) {
    
    
    this.formatInputValue(event);
    console.log(this.inputValue);
    let inputValueNumber = Number(this.inputValueCache.replace(/,/g, ''));
    let inputAmount: number = this.validateInputValue(inputValueNumber);
    this.updatePercentageBar(inputAmount);
  }

  /**
   * @description - This function is used to format the input value of the money input field.
   * It checks if the key pressed is a number, delete key, or arrow key and formats the input value accordingly.
   * @param event - The event that is triggered when the user types in the input field.
   * @returns - The formatted input value in the en-US format.
   * @example - 1234567.89 => '1,234,567.89' 
   */
  formatInputValue(event: any) {
    const deleteKeys = ['Backspace', 'Delete'];
    const otherKeys = ['ArrowLeft', 'ArrowRight', 'Tab'];
    const isNumberKey = /^[0-9]$/.test(event.key);

    let formatInputValue: number = 0;

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

    return formatInputValue;
  }

  /**
   * @description - This function is used to add a number to the target input value.
   * It checks if the key pressed is a number and adds it to the input value.
   * @param event - The event that is triggered when the user types in the input field.
   */
  addNumberToTargetInput(event: any) {
    let currentTarget = this.inputValueCache;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    if (numbersArray.length === 3 && numbersArray[0] === '0') {
      numbersArray.shift();
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.inputValueCache = parseFloat(numbersArray.join('')).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
        }
      );
    } else if (
      numbersArray.length >= 3 &&
      numbersArray.length < 11 &&
      numbersArray[0] !== '0'
    ) {
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.inputValueCache = parseFloat(numbersArray.join('')).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
        }
      );
    }
  }

  /**
   * @description - This function is used to delete a number from the target input value.
   * It checks if the key pressed is a delete key and removes the last number from the input value.
   */
  deleteNumberFromTargetInput() {
    let currentTarget = this.inputValueCache;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    numbersArray.pop();
    numbersArray.splice(numbersArray.length - 2, 0, '.');
    this.inputValueCache = parseFloat(numbersArray.join('')).toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
      }
    );
  }

  /**
   * @description - This function is used to validate the input value of the money input field.
   * It checks if the input value is greater than 0 and less than or equal to the remaining amount and balance.
   * It also updates the input value accordingly.
   * @param inputValueNumber - The input value number to be validated.
   * @returns - The validated input amount. 
   */
  validateInputValue(inputValueNumber: number) {
    let inputAmount: any;
    let balance = this.dataStore.balance().balance;
    let remainingAmount = this.currentPot.target - this.currentPot.total;
    // if the input value is null, less than or equal to 0, or undefined, set the input amount to 0
    if (
      inputValueNumber === null ||
      inputValueNumber <= 0 ||
      inputValueNumber === undefined
    )
      inputAmount = 0;
    setTimeout(() => {
      let value = inputAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
      [this.inputValue, this.inputValueCache] = [value, value];
    }, 10);
    // if the input value is greater than 0 and less than or equal to the remaining amount and the balance, set the input amount to the input value
    if (
      inputValueNumber &&
      inputValueNumber <= remainingAmount &&
      inputValueNumber <= balance
    ) {
      inputAmount = inputValueNumber;
      setTimeout(() => {
        let value = inputAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        });
        [this.inputValue, this.inputValueCache] = [value, value];
      }, 10);
    }
    // if the input value is greater than 0 and greater than the remaining amount and the balance, set the input amount to the remaining amount
    if (
      inputValueNumber &&
      inputValueNumber > remainingAmount &&
      balance >= remainingAmount
    ) {
      inputAmount = remainingAmount;
      setTimeout(() => {
        let value = inputAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        });
        [this.inputValue, this.inputValueCache] = [value, value];
      }, 10);
    }
    // if the input value is greater than 0 and greater than the remaining amount and the balance, set the input amount to
    if (
      inputValueNumber &&
      inputValueNumber > balance &&
      remainingAmount > balance
    ) {
      inputAmount = balance;
      setTimeout(() => {
        let value = inputAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        });
        [this.inputValue, this.inputValueCache] = [value, value];
      }, 10);
    }

    return inputAmount;
  }
  // #endregion

  // #region Progress Bar
  public percentageNumber: number = 0;
  public percentage: string = '';
  public progressBarPercentage: string = '';
  public prevPercentageBar: string = '';
  public amountPercentageBar: number = 0;

  /**
   * @description - This function is used to update the progress bar percentage and the amount percentage bar.
   * It takes the input value and calculates the percentage of the current pot total and target.
   * It also updates the new amount to be displayed in the modal.
   * @param value - The value to be used to update the progress bar.
   */
  updatePercentageBar(value: number) {
    let inputAmount = value;
    this.progressBarPercentage =
      Math.trunc(
        ((this.currentPot.total + inputAmount) / this.currentPot.target) * 100
      ).toFixed(0) + '%';
    this.percentage = (
      Math.trunc(
        ((this.currentPot.total + inputAmount) / this.currentPot.target) * 1000
      ) / 10
    ).toFixed(1);
    this.amountPercentageBar = Math.floor(
      (inputAmount / (this.currentPot.total + inputAmount)) * 100
    );
    this.newAmount = (inputAmount + this.currentPot.total).toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
      }
    );
  }
  // #endregion

  // #region Submit Add Money
  /**
   * @description - This function is used to submit the add money request.
   * It checks if the input value is greater than 0.00 and updates the pot total and transaction.
   * It also hides the main modal after the transaction is completed.
   */
  submitAddMoney() {
    if (this.inputValue && this.inputValue > '0.00') {
      this.currentPot.total =
        this.currentPot.total + Number(this.inputValueCache.replace(/,/g, ''));
      this.apiPotService.updatePot(
        'pots',
        'addMoneyPot',
        this.currentPotIndex,
        this.currentPot
      );
      this.apiTransactionService.startTransactionFromPots(
        'potAdd',
        new Date().toISOString(),
        Number(this.inputValueCache.replace(/,/g, '')),
        this.currentPotIndex,
        this.currentPot.theme
      );
      this.mainModalService.hideMainModal();
    }
  }
  // #endregion
}
