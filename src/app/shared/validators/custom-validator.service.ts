import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

type ValidateResultInterface = ValidationErrors | null;
interface TimeObject {
  hour: number;
  minute: number;
}
interface DateObject {
  year: number;
  month: number;
  day: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomValidator {

  constructor() { }

  static EmailValidator(control: AbstractControl): ValidateResultInterface {
    const re =
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!control.value || control.value === '' || re.test(control.value)) {
      return null;
    } else {
      return { invalidEMail: true };
    }
  }

  /*
  ********************************************************************************
  *****
  ***
  * Number
  ***
  *****
  ********************************************************************************
  */

  static isNumber(control: AbstractControl): ValidateResultInterface {
    if (isNaN(control.value)) {
      return { NaN: true}
    } else {
      return null;
    }
  }

  static noNegativeNumbers(control: AbstractControl): ValidationErrors | null {
    return control.value < 0 ? { negativeNumber: true } : null;
  }

  static isNumberBetween(num1: number, num2: number): ValidatorFn {
    return (control: AbstractControl): ValidateResultInterface => {
      if (parseInt(control.value) >= num1 && parseInt(control.value) <= num2) {
       return null;
      } else {
        return { numberNotBetween: true}
      }
    }
  }

  /**
   *
   * @param number
   * @returns
   */
  static isMinNumber(number:number): ValidatorFn {
    // test: ['', CustomValidator.isMinNumber(1)]
    return (control: AbstractControl): ValidateResultInterface => {
      if (parseInt(control.value) < number) {
        return { numberToSmall: true}
      } else {
        return null;
      }
    }
  }

  /*
  ********************************************************************************
  *****
  ***
  * Date
  ***
  *****
  ********************************************************************************
  */
  static dateAfterToday(control: AbstractControl): ValidateResultInterface {
    const now: number = Number(CustomValidator.getCurrentDate());
    let forwardDate: number = 0;
    let diff: number = 0;

    if (!control.value || control.value === '') {
      return null;
    } else {
      forwardDate = new Date(
        control.value.year,
        control.value.month - 1,
        control.value.day,
        0,
        0,
        0
      ).getTime();
    }

    diff = forwardDate - now;
    if (diff < 0) {
      return { dateBeforeToday: true }; // This is our error!
    }

    return null;
  }

  /**
   *
   *
   * @static
   * @param {string} startDateObj
   * @param {string} endDateObj
   * @return {*}
   * @memberof CustomValidators
   */
  static startDateNotBeforeEndDate(startDateObj: string, endDateObj: string) {
    return (formGroup: FormGroup): void | ValidateResultInterface => {
      const startDate: AbstractControl = formGroup.controls[startDateObj];
      const endDate: AbstractControl = formGroup.controls[endDateObj];

      if (startDate && endDate) {
        if (startDate.value && endDate.value) {
          const timeObj: TimeObject = {
            hour: 0,
            minute: 0,
          };
          const startDatetime: number = Number(
            CustomValidator.getDateObjectOrTimestamp(startDate.value, timeObj)
          );
          const endDatetime: number = Number(
            CustomValidator.getDateObjectOrTimestamp(endDate.value, timeObj)
          );
          const diff: number = endDatetime - startDatetime;

          if (diff < 0) {
            startDate.setErrors({
              ...startDate.errors,
              ...{ startDatetimeBeforeEndDatetime: true },
            });

            endDate.setErrors({
              ...endDate.errors,
              ...{ startDatetimeBeforeEndDatetime: true },
            });

            return { startDatetimeBeforeEndDatetime: true }; // This is our error!
          }
        }
      }
    };
  }

    /**
   * get a date object or a timestamp from the handed over date and time object
   *
   * @private
   * @param {DateObject} dateObj
   * @param {TimeObject} timeObject
   * @param {boolean} [asTimestamp=false]
   * @return {*}  {(number | Date)}
   * @memberof CustomValidators
   */
    private static getDateObjectOrTimestamp(
      dateObj: DateObject,
      timeObject: TimeObject,
      asTimestamp: boolean = true
    ): number | Date {
      const date = new Date(
        dateObj.year,
        dateObj.month - 1,
        dateObj.day,
        timeObject.hour,
        timeObject.minute
      );
      if (asTimestamp) {
        return date.getTime();
      } else {
        return date;
      }
    }

    /**
   * get a date object or a timestamp from the current date with the time from 00:00:00
   *
   * @private
   * @static
   * @param {boolean} [asTimestamp=true]
   * @return {*}  {(number | Date)}
   * @memberof CustomValidators
   */
    private static getCurrentDate(asTimestamp: boolean = true): number | Date {
      const dt: Date = new Date();
      const dateNow = new Date(
        dt.getUTCFullYear(),
        dt.getUTCMonth(),
        dt.getUTCDate()
      );
      if (asTimestamp) {
        return dateNow.getTime();
      } else {
        return dateNow;
      }
    }
}
