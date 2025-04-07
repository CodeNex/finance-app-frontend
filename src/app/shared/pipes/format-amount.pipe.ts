import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAmount'
})
export class FormatAmountPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
