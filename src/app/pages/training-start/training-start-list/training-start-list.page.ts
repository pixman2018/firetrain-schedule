import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Interfaces
import {
  I_ComparisonResults,
  I_TrainingInWorkout,
} from 'src/app/shared/interfaces/I_TrainingInWorkout';
import { I_TotalValue, I_Workout } from 'src/app/shared/interfaces/I_Workout';
// Servvices
import { DateService } from 'src/app/shared/services/date/date.service';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';

@Component({
  selector: 'app-training-start-list',
  templateUrl: './training-start-list.page.html',
  styleUrls: ['./training-start-list.page.scss'],
})
export class TrainingStartListPage implements OnInit {
  protected workout: I_Workout | undefined;
  protected trainings: I_TrainingInWorkout[] = [];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _workoutService: WorkoutService,
    private _trainingInWorkout: TrainingInWorkoutService,
    private _dateService: DateService,
    private _helperService: HelperService,
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  /**
   * @description
   * gets the current workout
   *
   * When the subscription is ended,
   * the trainings from this workout will be loaded
   *
   * @param workoutKey
   *
   */
  private _fetchWorkout(workoutKey: string) {
    this._workoutService.fetchByKey(workoutKey).subscribe({
      next: (workout) => {
        this.workout = workout;
      },
      error: (error) => console.error('ERROR, Workout not found', error),
      complete: () => {
        this._fetchAllTrainingsInWorkout(workoutKey);
      },
    });
  }
  /**
   *
   * @description
   * gets all trainings from the current workout
   *
   * @param workoutKey
   *
   */
  private _fetchAllTrainingsInWorkout(workoutKey: string) {
    this._trainingInWorkout
      .fetchAllTrainingInWorkout(workoutKey)
      .subscribe((training) => {
        this.trainings = training;
      });
  }

  /**
   *
   * @description
   * creates the training results and saves them in “training Result”
   * and sets the end of the training time “endDateTmp”
   * and the total “workout time” in workout
   *
   */
  protected onFinishWorkout() {
    const totalValueObj: I_TotalValue = this._createTotalValueDefaultPbj();

    this.trainings.forEach((training) => {
      if (training.trainingResults[0]) {
        const prevResult = training.trainingResults[1];
        // currentResult, prevResult
        const comparisonResultsDefaultObj =
          this._createDefaultComparisonResultsObj();
        const comparisonResultsObj = this._calcResult(
          training,
          comparisonResultsDefaultObj
        );

        // total Result
        for (
          let j = 0;
          j < comparisonResultsObj.currentNgativeRepsAndWeight.length;
          j++
        ) {
          comparisonResultsObj.currentTotalResult =
            comparisonResultsObj.currentTotalResult +
            comparisonResultsObj.currentRepsAndWeights[j];

          comparisonResultsObj.currentTotalResultWithNReps =
            comparisonResultsObj.currentTotalResultWithNReps +
            comparisonResultsObj.currentNgativeRepsAndWeight[j];


          if (!prevResult) {
            comparisonResultsObj.prevTotalResult = 0;
            comparisonResultsObj.prevNgativeRepsAndWeightTotalResult = 0;
          } else {
            comparisonResultsObj.prevTotalResult =
              comparisonResultsObj.prevTotalResult ?? 0+
              comparisonResultsObj.prevRepsAndWeights[j] ?? 0;
            comparisonResultsObj.prevNgativeRepsAndWeightTotalResult =
              comparisonResultsObj.prevNgativeRepsAndWeightTotalResult ?? 0+
              comparisonResultsObj.prevRepsAndWeights[j] ?? 0;
          }
        }
        training.comparisonResults.unshift(comparisonResultsObj);

        this._trainingInWorkout
          .editTrainingInWorkout(training)
          .then((res) => {
            if (this.workout?.key) {
              this._router.navigateByUrl(
                `/training-start-analysis/${this.workout.key}`,
                {
                  replaceUrl: true,
                }
              );
            }
          })
          .catch((error) => {
            console.error('Error bei edit training in Workout', error);
          });
      }

      if (training.comparisonResults[0]) {
        totalValueObj.totalResult =
          totalValueObj.totalResult +
          training.comparisonResults[0].currentTotalResult;
        totalValueObj.totalResultAndNReps =
          totalValueObj.totalResultAndNReps +
          training.comparisonResults[0].currentTotalResultWithNReps;
        totalValueObj.prevTotalResult =
          totalValueObj.prevTotalResult +
          training.comparisonResults[0].prevTotalResult;
        totalValueObj.prevTotalResultAndNReps =
          totalValueObj.prevTotalResultAndNReps +
          training.comparisonResults[0].prevNgativeRepsAndWeightTotalResult;
      }
    });

    // sets the end of the training time “endDateTmp” and the total “workout time” in workout
    if (this.workout) {
      this.workout.trainingsdayTstamps[0].endDateTmp = Date.now();
      this.workout.trainingsdayTstamps[0].workoutTime =
        this.workout.trainingsdayTstamps[0].endDateTmp -
        this.workout.trainingsdayTstamps[0].startDateTmp;
        this.workout.trainingsdayTstamps[0].workoutTimeObj = this._dateService.getTimeFromTstamp(this.workout.trainingsdayTstamps[0].workoutTime);
      this.workout?.totalValue.push(totalValueObj);
      this._workoutService.edit(this.workout);
    }
  }

  /**
   *
   * @description
   * create the total value default object
   *
   * @returns total value default object
   */
  private _createTotalValueDefaultPbj(): I_TotalValue {
    return {
      // repsTotal: 0,
      // nrepsTotal: 0,
      // setsTotal: 0,
      // weightsTotal: 0,
      totalResult: 0,
      totalResultAndNReps: 0,
      prevTotalResult: 0,
      prevTotalResultAndNReps: 0,
      stopWorkoutTmp: Date.now(),
    };
  }

  /**
   *
   *  @description
   * create the comparison results default object
   *
   * @returns comparison results degault object
   */
  private _createDefaultComparisonResultsObj(): I_ComparisonResults {
    return {
      count: 0,
      dateTmp: 0,
      trainingTmp: 0,

      currentRepsAndWeights: [],
      currentNgativeRepsAndWeight: [],

      percentAndWeights: [],
      prevNgativeRepsAndWeights: [],
      prevRepsAndWeights: [],

      currentTotalResult: 0,
      currentTotalResultWithNReps: 0,
      prevTotalResult: 0,
      prevNgativeRepsAndWeightTotalResult: 0,
    };
  }

  /**
   *
   *  @description
   * calculates the total results for this training
   *
   * @returns comparison results object
   */
  private _calcResult(
    training: I_TrainingInWorkout,
    comparisonResultsObj: I_ComparisonResults
  ): I_ComparisonResults {
    const currentResult = training.trainingResults[0];
    const prevResult = training.trainingResults[1];

    comparisonResultsObj.count = comparisonResultsObj.count + 1;
    comparisonResultsObj.dateTmp = this._dateService.getNowDatAsTstamp();
    comparisonResultsObj.trainingTmp = currentResult.trainingsdayTstamp;

    for (let j = 0; j < training.trainingResults[0].weights.length; j++) {
      const currentRepsAndWeights: number =
        this._helperService.round2Digits(currentResult.weights[j] * currentResult.reps[j]);
      const currentNgativeRepsAndWeight: number =
      this._helperService.round2Digits((currentResult.weights[j] * currentResult.negativeReps[j]) / 2);

      comparisonResultsObj.currentRepsAndWeights.push(currentRepsAndWeights);
      comparisonResultsObj.currentNgativeRepsAndWeight.push(
        this._helperService.round2Digits(currentNgativeRepsAndWeight + currentRepsAndWeights)
      );

      if (!prevResult) {
        comparisonResultsObj.percentAndWeights.push(0);
        comparisonResultsObj.prevRepsAndWeights.push(0);
        comparisonResultsObj.prevNgativeRepsAndWeights.push(0);
      } else {
        let weights = prevResult.weights[j] && !isNaN(prevResult.weights[j]) ? prevResult.weights[j] : 0;
        let reps = prevResult.reps[j] && !isNaN(prevResult.reps[j]) ? prevResult.reps[j] : 0;
        let nreps = prevResult.negativeReps[j] && !isNaN(prevResult.negativeReps[j]) ? prevResult.negativeReps[j] : 0;

        const prevepsAndWeights: number = weights * reps;
        comparisonResultsObj.prevRepsAndWeights.push(prevepsAndWeights);

        const prevNegativeRepsAndWeight: number = (weights * nreps) / 2;
        comparisonResultsObj.prevNgativeRepsAndWeights.push(
          prevNegativeRepsAndWeight + prevepsAndWeights
        );
        comparisonResultsObj.percentAndWeights.push(
          this._calcPercent(
            currentNgativeRepsAndWeight,
            prevNegativeRepsAndWeight
          )
        );
      }
    }

    return comparisonResultsObj;
  }

  /**
   *
   * calculates the percentage value
   *
   * @param currentRepWeight
   * @param prevRepWeight
   * @returns result from percent calc
   *
   */
  private _calcPercent(
    currentRepWeight: number,
    prevRepWeight: number
  ): number {
    /**
     * 100% = 200
     * ? = 50
     * ? = 50 / 200 * 100 = 25%;
     */
    return !prevRepWeight
      ? 100
      : Math.round((currentRepWeight / prevRepWeight) * 100 * 100) / 100;
  }

  /**
   *
   * If the "userId" is not valid, go to login
   *
   * If "workoutkey" is not available then go to "workout list page"
   *
   */
  private _initComponent(): void {
    const userId: string | null = sessionStorage.getItem('uid');
    const workoutKey: string | null = this._route.snapshot.paramMap.get('key');
    if (workoutKey && userId) {
      this._fetchWorkout(workoutKey);
    } else {
      if (!userId) {
        this._router.navigateByUrl(`/auth`, {
          replaceUrl: true,
        });
      } else {
        this._router.navigateByUrl(`/workout-list`, {
          replaceUrl: true,
        });
      }
    }
  }
}
