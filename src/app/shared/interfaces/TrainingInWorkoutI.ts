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
  count: number;
  userKey: string;
  isWarmUp: boolean;
  trainingResults: TrainingResultsI[] | [];
  lessTrainingResults: TrainingResultsI[] | [];
  created: number;
  updated: number;
}

export interface TrainingResultsI {
  isRoot?: boolean;
  date: number;
  sets: number;
  goalReps: number[];
  weights: number [];
  negativeReps: number[];
  reps: number[];
  note: string;
}

