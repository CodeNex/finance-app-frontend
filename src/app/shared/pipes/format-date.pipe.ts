import { Pipe, PipeTransform } from '@angular/core';

/**
 * * FormatDatePipe
 * This pipe is responsible for formatting a date string into a more readable format.
 * It takes a date string as input and returns a formatted date string.
 * It uses the toLocaleDateString method to format the date.
 */
@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: string,): string {
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
