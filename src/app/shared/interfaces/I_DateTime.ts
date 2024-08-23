export interface I_DatetimeObj {
  day: string;
  month: string;
  year: string | number;
}

export interface I_DateObj {
  day: string;
  month: string;
  year: string | number;
}

export interface I_TimeObj {
  day?: string,
  hours: string;
  minutes: string;
  seconds: string;
  miliseconds?: string;
}

export enum E_ObjType {
  date = 'date',
  time = 'time',
  datetime = 'datetime',
}
