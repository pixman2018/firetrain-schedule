import { Injectable } from '@angular/core';
import {
  E_ObjType,
  I_DateObj,
  I_DatetimeObj,
  I_TimeObj,
} from '../../interfaces/I_DateTime';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private _date: Date = new Date();
  private _currentMonth: number[] = [
    0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ];
  private _leapYear = 1904;
  private _highestYear = this._date.getFullYear();

  constructor() {}

  /**
   *
   * Converts a current date to an object of type “Datetime”.
   *
   * The parameter “objType” is used to specify which object type
   * the date is converted to (date, time or datetime)
   * and return this Object
   *
   * @param tstamp
   * @param objType is date, time oor datetime
   * @returns
   */
  public getDatetimeObjFromtstamp(
    tstamp: number,
    objType: E_ObjType
  ): I_DateObj | I_TimeObj | I_DatetimeObj | {} {
    let datetimeObj: {} | I_DateObj | I_TimeObj | I_DatetimeObj = {};
    const date = new Date(tstamp);
    switch (objType) {
      case E_ObjType.date:
        datetimeObj = {
          day: date.getDate().toString().padStart(2, '0'),
          month: Math.floor(date.getMonth() + 1)
            .toString()
            .padStart(2, '0'),
          year: date.getFullYear().toString(),
        };
        break;
      case E_ObjType.time:
        datetimeObj = {
          hours: date.getHours().toString().padStart(2, '0'),
          minutes: date.getMinutes().toString().padStart(2, '0'),
          seconds: date.getSeconds().toString().padStart(2, '0'),
          milliseconds: date.getMilliseconds().toString().padStart(2, '0'),
        };
        break;
      case E_ObjType.datetime:
        datetimeObj = {
          day: date.getDate().toString().padStart(2, '0'),
          month: Math.floor(date.getUTCMonth() + 1)
            .toString()
            .padStart(2, '0'),
          year: date.getFullYear().toString(),
          hours: date.getHours().toString().padStart(2, '0'),
          minutes: date.getMinutes.toString().padStart(2, '0'),
          seconds: date.getSeconds.toString().padStart(2, '0'),
          milliseconds: date.getMilliseconds().toString().padStart(2, '0'),
        };
        break;
    }
    if (Object.keys(objType).length < 1) {
      console.error('empty dateObj in datetime service!');
    }
    return datetimeObj;
  }

  /**
   * converts a timestamp into a "date object" of type Time
   *
   * @param tstamp
   * @returns
   */
  public getTimeFromTstamp(tstamp: number): I_TimeObj {
    // example https://blog.axxg.de/zeitdifferenz-konvertieren-mit-modulo/
    const hours: number = Math.floor(tstamp / (1000 * 60 * 60));
    tstamp = tstamp % (1000 * 60 * 60);
    const minutes: number = Math.floor(tstamp / (1000 * 60));
    tstamp = tstamp % (1000 * 60);
    const seconds: number = Math.floor(tstamp / 1000);
    tstamp = tstamp % 1000;
    return {
      hours: this.zeroPad(hours),
      minutes: this.zeroPad(minutes),
      seconds: this.zeroPad(seconds),
      miliseconds: this.zeroPad(tstamp),
    };
  }

  /**
   *
   * get a now timestamp by year month and day
   *
   * @returns number timestamp
   */
  public getNowDatAsTstamp(): number {
    const dateTime: Date = new Date();
    let date: number | Date = new Date(
      `${dateTime.getFullYear()}-${this.zeroPad(
        dateTime.getMonth() + 1
      )}-${this.zeroPad(dateTime.getDate())}`
    );
    return date.getTime();
  }

  /**
   *
   * get the current date as string
   *
   * @returns datestring
   */
  public getNowDateasString(): string {
    const dateTime: Date = new Date();
    return `${dateTime.getFullYear()}-${this.zeroPad(
      dateTime.getMonth() + 1
    )}-${this.zeroPad(dateTime.getDate())}`;
  }

  /**
   *
   * get a now timestamp by hours, minutes, seconds
   * and optional milliseconds
   *
   * @returns number timestamp
   */
  public getNowTimeAsTstamp(withMilliseconds: boolean = false): number {
    const dateTime: Date = new Date();
    let timeStr: string = '';
    if (withMilliseconds) {
      timeStr = `${dateTime.getHours()}:
        ${dateTime.getMinutes()}:
        ${dateTime.getSeconds()}`;
    } else {
      timeStr = `${dateTime.getHours()}:
        ${dateTime.getMinutes()}:
        ${dateTime.getSeconds()}
        ${dateTime.getMilliseconds()}`;
    }
    let time: number | Date = new Date(timeStr);
    return time.getTime();
  }

  public getDayOfMonth(month: number, year: number, debug: boolean = false): number {
    this._currentMonth = [
      0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ];
    if (debug) {
      console.log('start', month, ' - y ', year,  ' -- current Month', this._currentMonth[2])
    }
    if (!month) {
      console.error('The smallest number is 1');
      throw new Error('The smallest number is 1');
      // return null;
    } else if (month == 2) {
      for (let y = this._leapYear; y <= this._highestYear; y += 4) {
        if (y == year) {
          if (debug) {
            alert();
            console.log('y', y, 'year', year)
          }
          this._currentMonth[2] = 29;
        }
      }
    }
    if (debug) {
      console.log('m', this._currentMonth[month]);
      console.log(year)
    }

    return this._currentMonth[month];
  }

  public zeroPad(number: number): string {
    return number.toString().padStart(2, '0');
  }
}
