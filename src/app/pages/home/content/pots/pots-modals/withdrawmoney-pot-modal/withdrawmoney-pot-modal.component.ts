import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';
import { ApiPotsService } from '../../api-pots.service';

@Component({
  selector: 'app-withdrawmoney-pot-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './withdrawmoney-pot-modal.component.html',
  styleUrl: './withdrawmoney-pot-modal.component.scss',
})
export class WithdrawmoneyPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public apiPotService: ApiPotsService = inject(ApiPotsService);

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
  public amountPercentageBar: number = 100;

  public inputValue: string = '0.00';
  public inputValueCache: string = '0.00';

  ngOnInit() {
    this.currentPot = this.modalObject;
    this.currentPotIndex = this.potIndex;
    console.log(this.currentPotIndex);
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

  // validates the input value and returns the value if it is valid
  validateInputValue(inputValueNumber: number) {
    let inputAmount: any;
    if (inputValueNumber <= this.currentPot.total) {
      inputAmount = inputValueNumber;
      setTimeout(() => {
        let value = inputAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        });
        [this.inputValue, this.inputValueCache] = [value, value];
      }, 10);
    }
    if (inputValueNumber > this.currentPot.total) {
      inputAmount = this.currentPot.total;
      setTimeout(() => {
        let value = this.currentPot.total.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        });
        [this.inputValue, this.inputValueCache] = [value, value];
      }, 10);
    }
    return inputAmount;
  }

  // updates the percentage bar when the user types in the input field
  updatePercentageBar(value: number) {
    let inputAmount = value;
    this.percentage = (
      Math.trunc(
        ((this.currentPot.total - inputAmount) / this.currentPot.target) * 1000
      ) / 10
    ).toFixed(1);
    this.amountPercentageBar = 100;
    this.amountPercentageBar =
      this.amountPercentageBar -
      Math.floor((inputAmount / this.currentPot.total) * 100);
    this.newAmount = (this.currentPot.total - inputAmount).toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
      }
    );
  }

  // commits the withdrawal of money from the pot
  commitWithdrawMoney() {
    if (this.inputValue && this.inputValue > '0.00') {
      this.currentPot.total =
        this.currentPot.total - Number(this.inputValueCache.replace(/,/g, ''));
      this.apiPotService.updatePot(
        'pots',
        'withdrawMoneyPot',
        this.currentPotIndex,
        this.currentPot
      );
      this.mainModalService.hideMainModal();
    }
  }
}
