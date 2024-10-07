export interface I_Build {
  currentIteration: number;
  buildVersion: string;
  timeStamp: number;
  buildNo: string;
}

export interface I_CurrentVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface I_VersionControl {
  key?: string;
  namespace: string;
  items: I_logItems,
  isPublished: boolean,
  build: {
    version: string,
    VersionNo: string,
    timeStamp: number,
  },
  createdTstamp: number,
  updatedTstamp: number,
}

export interface I_logItems {
  bugs?: I_language[],
  Bugs?:I_language[],
  feactures?: I_language[],
  Feactures?: I_language[],
}

export interface I_language {
  de: string,
  en: string,
  timestamp: number,
}
