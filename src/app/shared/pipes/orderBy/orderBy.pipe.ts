import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  standalone: true,
})
export class OrderByPipe implements PipeTransform {
  transform(items: any[], field: string, reverse: boolean = false): any[] {
    if (!items || !Array.isArray(items) || items.length <= 1) return items;

    // Creating a copy without altering the original array (side effects)
    const sortedItems = [...items];
    const fieldArray = field ? field.split(',').map((f) => f.trim()) : [];

    sortedItems.sort((a, b) => {
      let result = 0;

      if (fieldArray.length <= 1) {
        // Level 1: Simple field or direct item
        const currentField = fieldArray[0] || field;
        result = this.compare(a, b, currentField);
      } else {
        // Level 2 or 3
        const valA = this.getDeepValue(a, fieldArray);
        const valB = this.getDeepValue(b, fieldArray);
        result = this.compareValues(valA, valB);
      }

      // If reverse is true, we reverse the result.
      return reverse ? result : result * -1;
    });

    return sortedItems;
  }

  /**
   * Compares two objects using a field.
   */
  private compare(a: any, b: any, field: string): number {
    const valA = field ? a[field] : a;
    const valB = field ? b[field] : b;
    return this.compareValues(valA, valB);
  }

  /**
   * The core logic for comparing values
   */
  private compareValues(valA: any, valB: any): number {
    // 1. Boolean Check: true soll nach UNTEN (1), false nach OBEN (-1)
    if (typeof valA === 'boolean' && typeof valB === 'boolean') {
      if (valA === valB) return 0;
      return valA ? 1 : -1;
    }

    // 2. Number Check
    if (typeof valA === 'number' && typeof valB === 'number') {
      return valA - valB;
    }

    // 3. String / Fallback Check
    const strA = valA !== null && valA !== undefined ? valA.toString() : '';
    const strB = valB !== null && valB !== undefined ? valB.toString() : '';

    return strA.localeCompare(strB);
  }

  /**
   * retrieves value from deep structures (e.g., 'user,name,last')
   */
  private getDeepValue(obj: any, fields: string[]): any {
    return fields.reduce((prev, curr) => {
      return prev ? prev[curr] : undefined;
    }, obj);
  }
}
