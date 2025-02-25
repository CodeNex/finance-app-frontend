import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';

@Component({
  selector: 'app-addmoney-pot-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './addmoney-pot-modal.component.html',
  styleUrl: './addmoney-pot-modal.component.scss',
})
export class AddmoneyPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  @Input() public modalObject: Object = {};

  public currentPot: any = {
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    createdAt: null,
    deletedAt: null,
  };

  public newAmount: string = '';
  public targetAmount: string = '';

  public percentageNumber: number = 0;
  public percentage: string = '';
  public progressBarPercentage: string = '';

  public prevPercentageBar: string = '';
  public amountPercentageBar: string = '';
  public differencePercentageBar: string = '';

  public inputValue: number | null = null;

  ngOnInit() {
    this.currentPot = this.modalObject;
    this.newAmount = this.currentPot.total.toFixed(2);
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

  validateInputValue() {
    let inputAmount: any;
    if (
      this.inputValue === null ||
      this.inputValue <= 0 ||
      this.inputValue === undefined
    ) {
      inputAmount = 0;
    }

    if (
      this.inputValue &&
      // I <= Rest
      this.inputValue <= this.currentPot.target - this.currentPot.total &&
      // I <= Current
      this.inputValue <= this.dataStore.balance().current
    ) {
      // Amount = I
      inputAmount = this.inputValue;
      setTimeout(() => {
        this.inputValue = inputAmount;
      }, 10);
    }

    if (
      this.inputValue &&
      // I >= Rest
      this.inputValue >= this.currentPot.target - this.currentPot.total &&
      // I <= Current
      this.inputValue <= this.dataStore.balance().current
    ) {
      inputAmount = this.currentPot.target - this.currentPot.total;
      setTimeout(() => {
        this.inputValue = inputAmount;
      }, 10);
    }

    if (
      this.inputValue &&
      this.inputValue <= this.currentPot.target - this.currentPot.total &&
      this.inputValue >= this.dataStore.balance().current
    ) {
      inputAmount = this.dataStore.balance().current;
      setTimeout(() => {
        this.inputValue = inputAmount;
      }, 10);
    }

    if (
      this.inputValue &&
      // I >= Rest
      this.inputValue >= this.currentPot.target - this.currentPot.total &&
      // I >= Current
      this.inputValue >= this.dataStore.balance().current
    ) {
      // Amount = Rest
      inputAmount = this.currentPot.target - this.currentPot.total;
      setTimeout(() => {
        this.inputValue = inputAmount;
      }, 10);
    }

    return inputAmount;
  }

  updatePercentageBar() {
    let inputAmount = this.validateInputValue();
    this.progressBarPercentage =
      Math.trunc(
        ((this.currentPot.total + inputAmount) / this.currentPot.target) * 100
      ).toFixed(0) + '%';

    console.log(inputAmount);
  }
}
