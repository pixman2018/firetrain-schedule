

export interface I_Workout {
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
  totalValue: I_TotalValue;
  // userIdConsumptions?: string;
  // lastDatesTstamp?: number;
  created: number;
  updated: number;
}

interface I_TotalValue {
  weightsTotal: number;
  repsTotal: number;
  setsTotal: number;
  totalValue: number; // weightsTotal * repsTotal
}

