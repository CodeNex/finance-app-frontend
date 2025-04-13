import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: unknown,): unknown {
    if (!value) {
      console.log('No value provided for date formatting');
      return '';
    } 
    const date = new Date(value as string)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).replace(',', '');
  }

}
