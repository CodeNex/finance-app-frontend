import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';

@Component({
  selector: 'app-withdrawmoney-pot-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './withdrawmoney-pot-modal.component.html',
  styleUrl: './withdrawmoney-pot-modal.component.scss',
})
export class WithdrawmoneyPotModalComponent {
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
  public amountPercentageBar: number = 100;

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

  // formats the input value to 2 decimal places
  formatInputValue(value: number | null): number {
    if (value === null || value === undefined) return 0;
    return Number(value.toFixed(2));
  }

  // validates the input value and returns the value if it is valid
  validateInputValue() {
    let inputAmount = this.formatInputValue(this.inputValue);
    if (inputAmount && inputAmount <= this.currentPot.total) {
      setTimeout(() => (this.inputValue = inputAmount), 10);
    }
    if (inputAmount && inputAmount > this.currentPot.total) {
      inputAmount = parseFloat(this.currentPot.total.toFixed(2));
      setTimeout(() => (this.inputValue = inputAmount), 10);
    }
    return inputAmount;
  }

  // updates the percentage bar when the user types in the input field
  updatePercentageBar() {
    let inputAmount = this.validateInputValue();
    this.percentage = (
      Math.trunc(
        ((this.currentPot.total - inputAmount) / this.currentPot.target) * 1000
      ) / 10
    ).toFixed(1);
    this.amountPercentageBar = 100;
    this.amountPercentageBar =
      this.amountPercentageBar -
      Math.floor((inputAmount / this.currentPot.total) * 100);
    this.newAmount = (this.currentPot.total - inputAmount).toFixed(2);
  }

  // commits the withdrawal of money from the pot
  commitWithdrawMoney() {
    if (this.inputValue && this.inputValue > 0) {
      this.currentPot.total = this.currentPot.total - this.validateInputValue();
      console.log(this.currentPot);
    }
  }
}
