export interface VersionControlI {
  key?: string;
  namespace: string;
  items: logItemsI,
  isPublished: boolean,
  build: buildI,
  createdTstamp: number,
  updatedTstamp: number,
}

export interface logItemsI {
  bugs?: languageI[],
  Bugs?:languageI[],
  feactures?: languageI[],
  Feactures?: languageI[],
}

export interface languageI {
  de: string,
  en: string,
  timestamp: number,
}

export interface buildI {
  version: string,
  VersionNo: string,
  timeStamp: number,
}
