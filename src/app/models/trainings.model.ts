import { I_Practic } from './practic.model';

export interface I_Training {
  id?: string;
  name: string;
}

export interface I_TrainingForm extends I_Training {
  createdAt: number;
  updatedAt: number;
}
