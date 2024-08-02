/**
 * This pipe sorts the content of the passed parameters.
 * If you need the sorting in the second level you have to set the Propertie 'field
 * Transfer a comma-separated list
 *
 * If you want to reverse the order you have to set the parameter 'reverse' to true
 * Default is false
 */

/**
  * Example:
  * Deep 1
  * *ngFor="let train of workout.trainings |orderBy: 'train'
  *
  * Deep 2
  * *ngFor="let train of workout.trainings |orderBy: 'train, order'
  *
  * Reverse the sort (: false or true)
  * |orderBy: 'train': false;
  */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderBy' })
export class OrderByPipe implements PipeTransform {
  /**
   *
   * @param items the cuttent item from the for ... of loop
   * @param field the property for deep, separate several with kammatas
   * @param reverse reverse the output arry (asc or desc)
   */
  transform(items: any[], field: any, reverse: boolean = false): any[]  {
    // console.log('items',items, ' -- field', field, ' --reverse', reverse)
    let fieldArray: string[] = [];
    // console.log('orderBy: ', field);
    // console.log('before: ', items);
    if (!items) return [];
    /**
     * If a pipe has a comma list then it is a deeparray
     */
    if (field.includes(',')) {
      fieldArray = field.split(',');
      // console.log('fieldArray', fieldArray)
    }
    // console.log('items', items)
    // console.log('field', field)
    if (field) {

      switch (fieldArray.length) {
        // deep level 1
        case 0:
          items.sort((a, b) => {
            if (a[field] && b[field]) {
              return a[field].toString().localeCompare(b[field]);
            }
          });
          break;
        case 2:
          // deep level 2
          items.sort((a, b) => {
            if (a[fieldArray[0]] && b[fieldArray[0]]) {
              // console.log('sort')
              const fielda = a[fieldArray[0].trim()][fieldArray[1].trim()];
              const fieldb = b[fieldArray[0].trim()][fieldArray[1].trim()];
              if (fielda && fieldb) {
                return fielda.toString().localeCompare(fieldb);
              }
              // if the loop in a loop nested
              // then is the deep from the first loop
              // not in the deep level 2 found
            } else if(a[fieldArray[1].trim()] >= 0 && b[fieldArray[1].trim()] >= 0) {
              // console.log('item', items)
              const fielda = a[fieldArray[1].trim()];
              const fieldb = b[fieldArray[1].trim()];
              // console.log('a', fielda)
              // console.log('b', fieldb)
              if (fielda >= 0 && fieldb >= 0) {
                if (typeof fielda == 'number' && typeof fieldb == 'number') {
                  // console.log('number')
                  return fielda - fieldb;
                } else {
                  // console.log('string')
                  return fielda.toString().localeCompare(fieldb);
                }
              }
            }
          });
          break;
        case 3:
          // deep level 3
          console.log('before', items);
          items.sort((a, b) => {
            if (a[fieldArray[0]] && b[fieldArray[0]]) {
              if (
                a[fieldArray[0]][fieldArray[1]] &&
                b[fieldArray[0]][fieldArray[1]]
              ) {
                const fielda =
                  a[fieldArray[0].trim()][fieldArray[1].trim()][
                    fieldArray[2].trim()
                  ];
                const fieldb =
                  b[fieldArray[0].trim()][fieldArray[1].trim()][
                    fieldArray[2].trim()
                  ];
                if (fielda && fieldb) {
                  return fielda.toString().localeCompare(fieldb);
                }
              }
            }
          });
          console.log('after', items);
          break;
      } // end switch
    } else {
      items.sort((a, b) => {
        return a.toString().localeCompare(b);
      });
    } // end if field

    if (reverse) {
      items.reverse();
    }
    // console.log('after: ', items);
    return items;
  }
}
