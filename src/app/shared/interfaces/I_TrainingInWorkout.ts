export interface I_TrainingInWorkout {
  namespace: string;
  key: string;
  workoutKeys: string[];
  workoutName: string;
  name: string;
  categoryId: number;
  trainingsRefKey: string;
  isNegativeWeight: boolean;
  order: number;
  goalRepsStart: number;
  goalRepsEnd: number;
  globalSets: number;
  count: number;
  userKey: string;
  isWarmUp: boolean;
  isBodyWeight: boolean;
  trainingResults: I_TrainingResults[];
  comparisonResults: I_ComparisonResults[];
  created: number;
  updated: number;
}

export interface I_ComparisonResults {
  count: number;
  trainingTmp: number;
  dateTmp: number;
  currentRepsAndWeights: number[],
  currentNgativeRepsAndWeight: number[],
  percentAndWeights: number[],
  prevNgativeRepsAndWeights: number[],
  prevRepsAndWeights: number[],
  currentTotalResult: number,
  currentTotalResultWithNReps: number,
  prevTotalResult: number,
  prevNgativeRepsAndWeightTotalResult: number,
}

export interface I_TrainingResults {
  // isRoot?: boolean;
  trainingsdayTstamp: number;
  sets: number;
  goalRepsStart: number;
  goalRepsEnd: number;
  weights: number [];
  negativeReps: number[];
  reps: number[];
  note: string;
  tmp: number[];
}

export interface I_TrainingFormResult {
  negativeReps: number;
  reps: number;
  weights: number;
}

export interface I_TrainingFormResults {
  negativeReps: number[];
  reps: number[];
  weights: number[];
  sets: number;
}

export interface I_ActionSetsCount {
  action: string | null;
  setsCount: number;
}

