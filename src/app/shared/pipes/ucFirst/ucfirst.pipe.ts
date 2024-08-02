import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ucfirst'
})
export class UcfirstPipe implements PipeTransform {

  transform(string: string | undefined): string {
    if (string && string.length > 0) {
      return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
    } else {
      return '';
    }

  }

}
