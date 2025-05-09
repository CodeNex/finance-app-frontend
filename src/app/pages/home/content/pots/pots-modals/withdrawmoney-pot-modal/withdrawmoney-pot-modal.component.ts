import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainModalService } from '@services/main-modal.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiPotsService } from '@content/pots/api-pots.service';
import { ApiTransactionService } from '@content/transactions/api-transaction.service';
import { FormatAmountInputService } from '@src/services/format-amount-input.service';

/**
 * * * * WithdrawmoneyPotModalComponent
 * * This component is responsible for displaying the withdraw money pot modal.
 * * It allows the user to withdraw money from an existing pot.
 * * It uses the MainModalService to manage the modal state and the ApiPotsService to interact with the backend.
 * * It also uses the ApiTransactionService to handle transactions related to the pot.
 * * It uses the FormatAmountInputService to format the input value.
 */
@Component({
  selector: 'app-withdrawmoney-pot-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './withdrawmoney-pot-modal.component.html',
  styleUrl: './withdrawmoney-pot-modal.component.scss',
})
export class WithdrawmoneyPotModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public dataStore = inject(DataStoreServiceService);
  public apiPotService = inject(ApiPotsService);
  public apiTransactionService = inject(ApiTransactionService);
  public formatAmountInputService = inject(FormatAmountInputService);

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

  public newAmount: string = ''; // template variable
  public targetAmount: string = ''; // template variable
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit() {
    this.currentPot = this.modalObject;
    this.currentPotIndex = this.potIndex;
    this.newAmount = this.formatToEnUS(this.currentPot.total, 'twoDigit');
    this.targetAmount = this.formatToEnUS(this.currentPot.target, 'zeroDigit');
    this.initializeProgressbar();
  }
  // #endregion

  // #region Helper Functions
  /**
   * @description - This function is responsible for initializing the progress bar.
   * It calculates the percentage of the current pot total and target:
   */
  private initializeProgressbar(): void {
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

  /**
   * @description - This function is responsible for formatting the input value to the en-US format.
   * @param value - The value to be formatted.
   * @returns - The formatted value in the en-US format.
   * @example - 1234567.89 => '1,234,567.89'
   */
  private formatToEnUS(
    value: number,
    digit: 'twoDigit' | 'zeroDigit' = 'twoDigit'
  ): string {
    if (value == null) return '';
    if (digit === 'twoDigit') {
      return `${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    if (digit === 'zeroDigit') {
      return `${value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    }
    return '';
  }

  /**
   * @description - This function is responsible for closing the main modal.
   * It uses the MainModalService to hide the modal and its child.
   */
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
  // #endregion

  // #region Input Control
  public inputValue: string = '0.00';
  public inputValueCache: string = '0.00';

  /**
   * @description - This function is used to control the input value of the money input field.
   * It uses the FormatAmountInputService to format the input value and validate it.
   * It formats the input value to the en-US format and updates the percentage bar.
   * It also validates the input value to ensure it is within the allowed range.
   * @param event - The event that is triggered when the user types in the input field.
   */
  public controlMoneyInput(event: KeyboardEvent): void {
    const inputAmountValue = this.formatAmountInputService.formatAmountInput(
      event,
      this.inputValue
    );
    if (inputAmountValue === 'Invalid Amount') return;
    let inputValueNumber = Number(inputAmountValue.replace(/,/g, ''));
    let inputAmount: number = this.validateInputValue(inputValueNumber);
    this.updatePercentageBar(inputAmount);
  }

  /**
   * @description - This function is used to validate the input value of the money input field.
   * It checks if the input value is greater than 0 and less than or equal to the remaining amount and balance.
   * @param inputValueNumber - The input value number to be validated.
   * @returns - The validated input amount.
   */
  private validateInputValue(inputValueNumber: number): number {
    let inputAmount: number = 0;
    if (inputValueNumber <= this.currentPot.total)
      inputAmount = inputValueNumber;
    if (inputValueNumber > this.currentPot.total)
      inputAmount = this.currentPot.total;

    setTimeout(() => {
      this.inputValue = this.formatToEnUS(inputAmount, 'twoDigit');
      this.newAmount = this.formatToEnUS(
        this.currentPot.total - inputAmount,
        'twoDigit'
      );
    }, 10);
    return inputAmount;
  }
  // #endregion

  // #region Progress Bar
  public percentageNumber: number = 0;
  public percentage: string = '';
  public progressBarPercentage: string = '';
  public prevPercentageBar: string = '';
  public amountPercentageBar: number = 100;

  /**
   * @description - This function is used to update the progress bar percentage and the amount percentage bar.
   * It takes the input value and calculates the percentage of the current pot total and target.
   * It also updates the new amount to be displayed in the modal.
   * @param value - The value to be used to update the progress bar.
   */
  private updatePercentageBar(value: number): void {
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
  }
  // #endregion

  // #region Submit Withdraw Money
  /**
   * * @description - This function is called when the user clicks the withdraw button in the modal.
   * * It checks if the input value is valid and if so, it updates the pot total and starts a transaction.
   */
  public submitWithdrawMoney(): void {
    if (this.inputValue && this.inputValue > '0.00') {
      this.currentPot.total =
        this.currentPot.total - Number(this.inputValue.replace(/,/g, ''));
      this.apiPotService.updatePot(
        'pots',
        'withdrawMoneyPot',
        this.currentPotIndex,
        this.currentPot
      );
      this.apiTransactionService.startTransactionFromPots(
        'potWithdraw',
        new Date().toISOString(),
        Number(this.inputValue.replace(/,/g, '')),
        this.currentPotIndex,
        this.currentPot.theme
      );
      this.mainModalService.hideMainModal();
    }
  }
  // #endregion
}
