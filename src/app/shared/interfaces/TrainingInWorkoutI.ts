import { DataI } from "./DataI";

export interface TrainingInWorkoutI {
  namespace: string;
  key: string;
  workoutkey: string;
  workoutName: string;
  name: string;
  isNegativeWeight: boolean;
  order: number;
  goalRepsStart: number;
  goalRepsEnd: number;
  globalSets: number;
  count: number;
  userKey: string;
  isWarmUp: boolean;
  trainingResults: TrainingResultsI[];
  lessTrainingResults: TrainingResultsI[] | [];
  created: number;
  updated: number;
}

export interface TrainingResultsI {
  // isRoot?: boolean;
  trainingsdayTstamp: number;
  sets: number;
  goalRepsStart: number;
  goalRepsEnd: number;
  weights: number [];
  negativeReps: number[];
  reps: number[];
  note: string;
}

export interface TrainingFormResultI {
  negativeReps: number;
  reps: number;
  weights: number;
}

export interface ActionSetsCountI {
  action: string | null;
  setsCount: number;
}
