import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { I_ComparisonResults, I_TrainingFormResult, I_TrainingFormResults, I_TrainingInWorkout, I_TrainingResults } from 'src/app/shared/interfaces/I_TrainingInWorkout';
import { I_Workout } from 'src/app/shared/interfaces/I_Workout';
import { DateService } from 'src/app/shared/services/date/date.service';

import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';



@Component({
  selector: 'app-training-start-list',
  templateUrl: './training-start-list.page.html',
  styleUrls: ['./training-start-list.page.scss'],
})
export class TrainingStartListPage implements OnInit, OnDestroy {
  // protected actionCtrlSub$ = new BehaviorSubject<string>('');
  protected workout: I_Workout | undefined;
  protected trainings: I_TrainingInWorkout[] = [];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _workoutService: WorkoutService,
    private _trainingInWorkout: TrainingInWorkoutService,
    private _dateService: DateService,
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  ngOnDestroy(): void {
    // this.actionCtrlSub$.unsubscribe();
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

  protected onFinishWorkout() {
    this.trainings.forEach(( training) => {
      if (training.trainingResults[0]) {
         // currentResult, prevResult
        // training.comparisonResults.unshift(this._calcResult( training, ));
        const result: I_ComparisonResults[] = this._calcResult( training, );
        training.comparisonResults = result;
      }

      this._trainingInWorkout.editTrainingInWorkout(training)
        .then((res) => {
          console.log('Edit training in Workout succsessgully');
          if (this.workout?.key) {
            this._router.navigateByUrl(`/training-start-analysis/${this.workout.key}`, {
              replaceUrl: true,
            });
          }
        })
        .catch(error => {
          console.error('Error bei edit training in Workout',error);
        })
    });
  }

  private _calcResult(training: I_TrainingInWorkout, ): I_ComparisonResults[] {
    const comparisonResultsArr = [];

    const currentResult = training.trainingResults[0];
    const prevResult = training.trainingResults[1];

    for (let j = 0; j < training.trainingResults[0].weights.length; j++ ) {
      const comparisonResults:I_ComparisonResults = {
        count: training.trainingResults[0].weights.length,
        currentRepsAndWeights: 0,
        currentNgativeRepsAndWeight: 0,
        percentAndWeights: 0,
        prevNgativeRepsAndWeights: 0,
        prevRepsAndWeights: 0,
        trainingTmp: 0,
        dateTmp: 0,
      }
      comparisonResults.currentRepsAndWeights = currentResult.weights[j] * currentResult.reps[j];
      comparisonResults.currentNgativeRepsAndWeight = currentResult.weights[j] * currentResult.negativeReps[j];
      comparisonResults.trainingTmp = currentResult.tmp[j];
      comparisonResults.dateTmp = this._dateService.getNowDatAsTstamp();

      if (!prevResult) {
        comparisonResults.prevRepsAndWeights = 0;
        comparisonResults.prevNgativeRepsAndWeights = 0;
        comparisonResults.percentAndWeights = 0;
      } else {
        comparisonResults.prevRepsAndWeights = prevResult.weights[j] * prevResult.reps[j];
        comparisonResults.prevNgativeRepsAndWeights = prevResult.weights[j] * prevResult.negativeReps[j];
        comparisonResults.percentAndWeights = this._calcPercent(
          currentResult.weights[j] * currentResult.reps[j],
          prevResult.weights[j] * prevResult.reps[j]
        );
      }

      comparisonResultsArr.push(comparisonResults);
    }
   return comparisonResultsArr;
  }

  // private _calcResult(training: I_TrainingInWorkout, ): I_ComparisonResults {
  //   const comparisonResults:I_ComparisonResults = {
  //     currentRepsAndWeights: [],
  //     prevRepsAndWeights: [],
  //     percentAndWeights: [],
  //     currentNgativeRepsAndWeights: [],
  //     prevNgativeRepsAndWeights: [],
  //     trainingTmp: [],
  //     count: training.trainingResults[0].weights.length,
  //   }

  //     for (let j = 0; j < training.trainingResults[0].weights.length; j++ ) {
  //       const result = training.trainingResults[0];
  //        type index = keyof Number;
  //       comparisonResults.currentRepsAndWeights.push(result.weights[j] * result.reps[j]);
  //       comparisonResults.trainingTmp.push(result.tmp[j]);
  //       comparisonResults.currentNgativeRepsAndWeights.push(result.negativeReps[j] * result.weights[j]);


  //       if (training.trainingResults[1]?.weights) {
  //         comparisonResults.prevRepsAndWeights.push(training.trainingResults[1].weights[j] ?? 0 * training.trainingResults[1].reps[j] ?? 0);
  //         comparisonResults.prevNgativeRepsAndWeights.push(training.trainingResults[1].negativeReps[j] * training.trainingResults[1].weights[j]);
  //         const weight = training.trainingResults[1].weights[j] + (training.trainingResults[1].negativeReps[j] / 2);
  //         comparisonResults.percentAndWeights.push(this._calcPercent(
  //           training.trainingResults[0].weights[j] * training.trainingResults[0].reps[j],
  //           weight * training.trainingResults[1].reps[j]
  //         ));
  //       } else {
  //         comparisonResults.prevRepsAndWeights.push(0);
  //         comparisonResults.percentAndWeights.push(0);
  //       }
  //     }
  //     console.log('comparisonResults', comparisonResults)
  //     return comparisonResults;
  // }

  private _calcPercent ( currentRepWeight: number, prevRepWeight: number): number {
    /**
    * 100% = 200
    * ? = 50
    * ? = 50 / 200 * 100 = 25%;
    */
    return !prevRepWeight ? 100 : Math.round( (currentRepWeight / prevRepWeight * 100) *100 ) / 100;
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
