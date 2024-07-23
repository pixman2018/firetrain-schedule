import { Injectable } from '@angular/core';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private _location: Location,
  ) { }

  /**
   *
   * get a now timestamp by year month and day
   *
   * @returns number timestamp
   */
  public getNowDatAsTstamp(): number {
    const dateTime: Date = new Date();
    let date: number | Date = new Date(`${dateTime.getFullYear()}-${dateTime.getMonth() +1}-${dateTime.getDate()}`);
    return date.getTime();
  }

  /**
   *
   * return new Array(number);
   *
   * @param number
   * @returns number[]
   *
   */
  createRange(number: number): number[]{
    return new Array(number).fill(0)
      .map((n, index) => index + 1);
  }

  /**
   * Back to the prev page
   */
  public backBtn(): void {
    this._location.back();
  }

  /**
   *
   * Check is Item exist
   * If not, the method is called again after 300 milliseconds
   *
   * @param item
   */
  public isItemExist(item: any): void {
    if (!item) {
      setTimeout(() => {
        this.isItemExist(item);
      }, 300);
    } 
  }

  public setTimeOut(): void | true {
    setTimeout(() => {
      return true;
    }, 300);
  }
}
