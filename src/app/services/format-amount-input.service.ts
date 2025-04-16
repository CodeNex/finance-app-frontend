import { Injectable } from '@angular/core';

/**
 * * * FormatAmountInputService
 * * This service is responsible for formatting the input amount in the application.
 * * * It provides methods to control the input value, add and delete numbers from the input,
 * * and format the input value to a specific format (en-US).
 */
@Injectable({
  providedIn: 'root',
})
export class FormatAmountInputService {

  public formatAmountInput() {

  }
  public amountInputValue: string = '0.00';

  /**
   * @description - This function is responsible for controlling the input value and starts either adding or deleting numbers from the input.
   * @param event - The keyboard event that is triggered when the user presses a key.
   */
  public controlMaxTarget(event: KeyboardEvent) {
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

  /**
   * @description - This function is responsible for adding numbers to the input value.
   * @param event - The keyboard event that is triggered when the user presses a key.
   * @returns - The formatted input value in the en-US format.
   */
  private addNumberToTargetInput(event: KeyboardEvent): void {
    let currentTarget = this.amountInputValue;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    if (numbersArray.length === 3 && numbersArray[0] === '0') {
      numbersArray.shift();
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.amountInputValue = this.formatToEnUS(
        parseFloat(numbersArray.join(''))
      );
    } else if (
      numbersArray.length >= 3 &&
      numbersArray.length < 11 &&
      numbersArray[0] !== '0'
    ) {
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.amountInputValue = this.formatToEnUS(
        parseFloat(numbersArray.join(''))
      );
    }
  }

  /**
   * @description - This function is responsible for deleting numbers from the input value.
   */
  private deleteNumberFromTargetInput(): void {
    let currentTarget = this.amountInputValue;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    numbersArray.pop();
    numbersArray.splice(numbersArray.length - 2, 0, '.');
    this.amountInputValue = this.formatToEnUS(parseFloat(numbersArray.join('')));
  }

  /**
   * @description - This function is responsible for formatting the input value to the en-US format.
   * @param value - The value to be formatted.
   * @returns - The formatted value in the en-US format.
   * @example - 1234567.89 => '1,234,567.89' 
   */
  private formatToEnUS(value: number): string {
    if (value == null) return '';
    return `${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}
