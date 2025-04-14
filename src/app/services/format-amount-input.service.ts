import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatAmountInputService {

  public maxBudgetInputValue: string = '0.00';
  public maxBudgetString: string = '0.00';

  public formatAmountInput(event: KeyboardEvent, maxBudgetInputValue: string, maxBudgetString: string): void {

  }

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

  private addNumberToTargetInput(event: KeyboardEvent): void {
    let currentTarget = this.maxBudgetString;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    if (numbersArray.length === 3 && numbersArray[0] === '0') {
      numbersArray.shift();
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.maxBudgetString = parseFloat(numbersArray.join('')).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
        }
      );
      this.maxBudgetInputValue = this.maxBudgetString;
    } else if (
      numbersArray.length >= 3 &&
      numbersArray.length < 11 &&
      numbersArray[0] !== '0'
    ) {
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.maxBudgetString = parseFloat(numbersArray.join('')).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
        }
      );
      this.maxBudgetInputValue = this.maxBudgetString;
    }
  }

  private deleteNumberFromTargetInput(): void {
    let currentTarget = this.maxBudgetString;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    numbersArray.pop();
    numbersArray.splice(numbersArray.length - 2, 0, '.');
    this.maxBudgetString = parseFloat(numbersArray.join('')).toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
      }
    );
    this.maxBudgetInputValue = this.maxBudgetString;

    this.maxBudgetString = this.formatToEnUS(parseFloat(numbersArray.join('')))
  }


private formatToEnUS(value: number): string {
  if (value == null) return '';
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
}
