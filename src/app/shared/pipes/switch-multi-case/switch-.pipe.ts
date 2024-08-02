import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngSwitchMultiCase'
})

/**
 * example:
 * <ng-container *ngSwitchCase="case | ngSwitchMultiCase : option1 : option2">
 */
export class NgSwitchMultiCasePipe implements PipeTransform {

  transform(caseField: string | undefined, ...options: string[]): string | undefined {
    if (caseField) {
      return options.includes(caseField) ? caseField : undefined;
    }
    return;
  }

}
