import { Pipe, PipeTransform } from '@angular/core';

/**
 * * FormatAmountPipe
 * * This pipe is responsible for formatting a number into a currency string.
 * * * It takes a number as input and returns a formatted string with a dollar sign and two decimal places.
 * * * It also takes an optional parameter to specify whether the amount is a credit or debit.
 */
@Pipe({
  name: 'formatAmount',
})
export class FormatAmountPipe implements PipeTransform {
  transform(value: number, type: 'credit' | 'debit' = 'credit'): string {
    if (value == null) return '';

    const prefix = type === 'debit' ? '-' : '';

    return `${prefix}$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}
