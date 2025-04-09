import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAmount',
})
export class FormatAmountPipe implements PipeTransform {
  transform(value: number, ...args: [type: string | null]): string {
    let outPut = '';

    if (value === null || value === undefined) {
      outPut = '';
    }

    if (args[0] === 'credit' || args[0] === null) {
      outPut = `$${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    if (args[0] === 'debit') {
      outPut = `-$${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return outPut;
  }
}
