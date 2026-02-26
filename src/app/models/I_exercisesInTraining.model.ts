export interface I_PractivesInTraining {
  name: string;
  practiveId: string;
  createdAt: number;
  updatedAt: number;
  results: [
    {
      reps: number;
      tmp: number;
      nreps: number;
      weight: number;
    },
  ];
}
