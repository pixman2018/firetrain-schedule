

export interface WorkoutI {
  namespace: string;
  name: string;
  userId: string;
  key?: string;
  count: number;
  // WorkoutI: number[];
  trainings?: [];
  trainingsdayTstamps: number[];
  isArchiv: boolean;
  folder: string;
  LengthOfTrainings: [];
  calorieConsumptions: [];
  totalValue: TotalValueI;
  // userIdConsumptions?: string;
  // lastDatesTstamp?: number;
  created: number;
  updated: number;
}

interface TotalValueI {
  weightsTotal: number;
  repsTotal: number;
  setsTotal: number;
  totalValue: number; // weightsTotal * repsTotal
}

