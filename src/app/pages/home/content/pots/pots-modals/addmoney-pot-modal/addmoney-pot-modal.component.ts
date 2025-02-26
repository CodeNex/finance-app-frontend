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
  public amountPercentageBar: number = 0;

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
    let balance = this.dataStore.balance().current;
    let remainingAmount = this.currentPot.target - this.currentPot.total;
    if (
      this.inputValue === null ||
      this.inputValue <= 0 ||
      this.inputValue === undefined
    )
      inputAmount = 0;

    if (
      this.inputValue &&
      this.inputValue <= remainingAmount &&
      this.inputValue <= balance
    ) {
      inputAmount = this.inputValue;
      setTimeout(
        () => (this.inputValue = Math.round((inputAmount * 100) / 100)),
        10
      );
    }

    if (
      this.inputValue &&
      this.inputValue > remainingAmount &&
      balance >= remainingAmount
    ) {
      inputAmount = remainingAmount;
      setTimeout(
        () => (this.inputValue = Math.round(inputAmount * 100) / 100),
        10
      );
    }

    if (
      this.inputValue &&
      this.inputValue > balance &&
      remainingAmount > balance
    ) {
      inputAmount = balance;
      setTimeout(
        () => (this.inputValue = Math.round(inputAmount * 100) / 100),
        10
      );
    }

    return inputAmount;
  }

  updatePercentageBar() {
    let inputAmount = this.validateInputValue();
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
    this.newAmount = (inputAmount + this.currentPot.total).toFixed(2);
  }

  commitAddMoney() {
    this.currentPot.total = this.currentPot.total + this.validateInputValue();
    console.log(this.currentPot);
  }
}
