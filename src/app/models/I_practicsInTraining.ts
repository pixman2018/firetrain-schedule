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

export interface I_PractivesInTrainingForm extends I_PractivesInTraining {
  createdAt: number;
  updatedAt: number;
}
