import { I_TimeObj } from "./I_DateTime";


export interface I_Workout {
  namespace: string;
  name: string;
  userId: string;
  key?: string;
  count: number;
  // WorkoutI: number[];
  trainings?: [];
  trainingsdayTstamps: I_TrainingsdayTstamps[];
  isArchiv: boolean;
  folder: string;
  LengthOfTrainings: [];
  calorieConsumptions: [];
  totalValue: I_TotalValue[];
  // userIdConsumptions?: string;
  // lastDatesTstamp?: number;
  workoutTime?: I_TimeObj;
  created: number;
  updated: number;
}

export interface I_TrainingsdayTstamps {
  startDateTmp: number;
  endDateTmp: number;
  workoutTime: number;
  workoutTimeObj: I_TimeObj;
}

export interface I_TotalValue {
  // repsTotal: number,
  // nrepsTotal: number,
  // setsTotal: number,
  // weightsTotal: number,
  totalResult: number,
  totalResultAndNReps: number,
  prevTotalResult: number,
  prevTotalResultAndNReps: number,
  stopWorkoutTmp: number,
}

