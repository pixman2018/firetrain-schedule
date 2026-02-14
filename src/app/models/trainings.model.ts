import { I_Practic } from './practic.model';

export interface I_Training {
  id?: string;
  name: string;
  practives: I_PractivesInTraining[];
}

export interface I_TrainingForm extends I_Training {
  createdAt: number;
  updatedAt: number;
}

export interface I_PractivesInTraining {
  name: string;
  practiveId: string;
  results: [
    {
      reps: number;
      tmp: number;
      nreps: number;
      weight: number;
    },
  ];
}
