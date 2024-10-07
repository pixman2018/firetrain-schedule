import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ucfirst'
})
export class UcfirstPipe implements PipeTransform {

  transform(string: string | undefined, allFirstLetter: boolean = false, isDebug: boolean = false): string {
    if (string && string.length > 0) {
      if (isDebug) {
        console.log('string', string, string.includes(' '), allFirstLetter)
      }

      let str: string = '';
       if(allFirstLetter) {
        if (string.includes(' ')) {
          const strSplit: string[] = string.split(' ');
          str = this._ucFirstByArray(strSplit).join(' ');
        }
      } else if (string.includes('-')) {
        const strSplit: string[] = string.split('-');
        str = this._ucFirstByArray(strSplit).join('-');
      }  else if (string.includes(' ')) {
        const strSplit: string[] = string.split(' ');
        str = this._ucFirstByArray(strSplit).join(' ');
      } else {
         str = string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
      }
      return str;
    } else {
      return '';
    }
  }

  private _ucFirstByArray(strSplit: string[]): string[] {
    for (let i =0; i < strSplit.length; i++) {
      strSplit[i] = strSplit[i].substring(0, 1).toUpperCase() + strSplit[i].substring(1).toLowerCase();
    }
    return strSplit;
  }

}

/*
  transform(string: string | undefined): string {
    if (string && string.length > 0) {
      return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
    } else {
      return '';
    }

  }
*/
