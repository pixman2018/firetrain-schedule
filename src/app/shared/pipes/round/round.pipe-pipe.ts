import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundPipe',
})
export class RoundPipe implements PipeTransform {
  transform(value: number | undefined, count: number = 2): string | null {
    if (value) {
      return value.toFixed(count);
    }
    return null;
  }
}
