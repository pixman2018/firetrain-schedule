import { Injectable } from '@angular/core';
import { E_ObjType, I_DateObj, I_DatetimeObj, I_TimeObj } from '../../interfaces/I_DateTime';



@Injectable({
  providedIn: 'root',
})
export class DateService {
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
  public getDatetimeObjFromtstamp(tstamp: number, objType: E_ObjType): I_DateObj | I_TimeObj | I_DatetimeObj | {} {
    let datetimeObj: {} | I_DateObj | I_TimeObj | I_DatetimeObj= {};
    const date = new Date(tstamp);
    switch (objType) {
      case E_ObjType.date:
        datetimeObj = {
          day: date.getDate().toString().padStart(2, '0'),
          month: Math.floor(date.getMonth() + 1).toString().padStart(2, '0'),
          year: date.getFullYear().toString(),
        }
        break;
      case E_ObjType.time:
        datetimeObj = {
          hours: date.getHours().toString().padStart(2, '0'),
          minutes:  date.getMinutes().toString().padStart(2, '0'),
          seconds: date.getSeconds().toString().padStart(2, '0'),
          milliseconds: date.getMilliseconds().toString().padStart(2, '0'),
        }
        break;
      case E_ObjType.datetime:
        datetimeObj = {
          day: date.getDate().toString().padStart(2, '0'),
          month: Math.floor(date.getUTCMonth() + 1).toString().padStart(2, '0'),
          year: date.getFullYear().toString(),
          hours: date.getHours().toString().padStart(2, '0'),
          minutes:  date.getMinutes.toString().padStart(2, '0'),
          seconds: date.getSeconds.toString().padStart(2, '0'),
          milliseconds: date.getMilliseconds().toString().padStart(2, '0'),
        }
        break;
    }
    if (Object.keys(objType).length < 1) {
      console.error ('empty dateObj in datetime service!');
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
    console.log('getTimeFromTstamp', tstamp);
    // example https://blog.axxg.de/zeitdifferenz-konvertieren-mit-modulo/
    const hours: number = Math.floor(tstamp / (1000*60*60));
    tstamp = tstamp % (1000*60*60);
    const minutes: number = Math.floor(tstamp / (1000*60));
    tstamp = tstamp % (1000*60);
    const seconds: number =  Math.floor(tstamp / 1000);
    tstamp = tstamp % 1000;
    return {
      hours: hours.toString().padStart(2,  '0'),
      minutes: minutes.toString().padStart(2,  '0'),
      seconds: seconds.toString().padStart(2,  '0'),
      miliseconds: tstamp.toString().padStart(2,  '0'),
    }
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
      `${dateTime.getFullYear()}-${
        dateTime.getMonth() + 1
      }-${dateTime.getDate()}`
    );
    return date.getTime();
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
}
