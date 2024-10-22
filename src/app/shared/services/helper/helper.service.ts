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
   * return new Array(number);
   *
   * @param number
   * @returns number[]
   *
   */
      /**
   *
   * @public
   * @param number
   * @returns number[]
   * @memberof HelperService
   *
   * @description
   * create a array with X length
   *
   */
  public createRange(number: number): number[]{
    return new Array(number).fill(0)
      .map((n, index) => index + 1);
  }

      /**
   *
   * @public
   * @memberof HelperService
   *
   * @description
   * Back to the prev page
   *
   */
  public backBtn(): void {
    this._location.back();
  }

      /**
   *
   * @protected
   * @param item
   * @memberof HelperService
   *
   * @description
    * Check is Item exist
   * If not, the method is called again after 300 milliseconds
   *
   */
  public isItemExist(item: any): void {
    if (!item) {
      setTimeout(() => {
        this.isItemExist(item);
      }, 300);
    }
  }

      /**
   *
   * @public
   * @returns void | true
   * @memberof HelperService
   *
   * @description
   * settimeout from 300ms
   *
   */
  public setTimeOut(): void | true {
    setTimeout(() => {
      return true;
    }, 300);
  }


    /**
   *
   * @public
   * @param number
   * @returns number
   * @memberof HelperService
   *
   * @description
   * rounds a number up to two decimal places
   *
   */
  public round2Digits(number: number): number {
   return Math.round(number * 100) / 100;
  }

      /**
   *
   * @public
   * @param lenght
   * @param base64
   * @returns string
   * @memberof HelperService
   *
   * @description
   * create a token
   *
   */
  public generateToken(lenght: number, base64: boolean = false): string {
    const chars: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_-+*';
    let token: string = '';
    for (let i = 0; i < lenght; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    if (base64) {
      btoa(token);
    }
    return token;
  }
}
