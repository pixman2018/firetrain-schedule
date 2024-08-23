import { I_Data } from "./I_Data";

export interface I_Training {
  categoryId: number;
  category: I_Data;
  created: number;
  devices: I_Data[];
  isGlobal: boolean;
  key?: string;
  namespace: string;
  pic: string;
  lang?: I_Data; // is not from the app
  name?: string; // is from user
  updated: number;
  userId: string;
  youtubeUrl: string;
}
