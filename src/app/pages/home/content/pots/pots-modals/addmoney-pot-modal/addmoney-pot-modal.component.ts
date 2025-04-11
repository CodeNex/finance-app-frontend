import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainModalService } from '@services/main-modal.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiPotsService } from '../../api-pots.service';
import { ApiTransactionService } from '@content/transactions/api-transaction.service';

@Component({
  selector: 'app-addmoney-pot-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './addmoney-pot-modal.component.html',
  styleUrl: './addmoney-pot-modal.component.scss',
})
export class AddmoneyPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public apiPotService: ApiPotsService = inject(ApiPotsService);
  public apiTransactionService: ApiTransactionService = inject(
    ApiTransactionService
  );

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  @Input() public modalObject: Object = {};
  @Input() public potIndex: number = -1;

  public currentPot: any = {
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    created_at: null,
    deleted_at: null,
  };

  public currentPotIndex: number = -1;

  public newAmount: string = '';
  public targetAmount: string = '';

  public percentageNumber: number = 0;
  public percentage: string = '';
  public progressBarPercentage: string = '';

  public prevPercentageBar: string = '';
  public amountPercentageBar: number = 0;

  public inputValue: string = '0.00';
  public inputValueCache: string = '0.00';

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

  // controls the money input field
  controlMoneyInput(event: any) {
    this.formatInputValue(event);
    let inputValueNumber = Number(this.inputValueCache.replace(/,/g, ''));
    let inputAmount: number = this.validateInputValue(inputValueNumber);
    this.updatePercentageBar(inputAmount);
  }

  // controls the maximum amount of the pot target
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

  // add a number to the target input
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

  // delete a number from the target input
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

  // validate the input value
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

  // update the percentage bar
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

  // submit the add money modal and new pot Object
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
}
