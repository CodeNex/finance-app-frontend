import { Pipe, PipeTransform } from '@angular/core';

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
