export interface datetimeObj {
  day: string;
  month: string;
  year: string | number;
}

export interface dateObj {
  day: string;
  month: string;
  year: string | number;
}

export interface timeObj {
  day?: string,
  hours: string;
  minutes: string;
  seconds: string;
  miliseconds?: string;
}

export enum ObjType {
  date = 'date',
  time = 'time',
  datetime = 'datetime',
}
