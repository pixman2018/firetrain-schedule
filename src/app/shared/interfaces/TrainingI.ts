import { DataI } from "./DataI";

export interface TrainingI {
  categoryId: number;
  category: DataI;
  created: number;
  devices: DataI[];
  isGlobal: boolean;
  key?: string;
  namespace: string;
  pic: string;
  lang?: DataI; // is not from the app
  name?: string; // is from user
  updated: number;
  userId: string;
  youtubeUrl: string;
}
