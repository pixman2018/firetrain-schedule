import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { I_ComparisonResults, I_TrainingFormResult, I_TrainingFormResults, I_TrainingInWorkout, I_TrainingResults } from 'src/app/shared/interfaces/I_TrainingInWorkout';
import { I_Workout } from 'src/app/shared/interfaces/I_Workout';

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
    private _trainingInWorkout: TrainingInWorkoutService
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
        training.lessTrainingResults.unshift(training.trainingResults[0]);
         // currentResult, prevResult
        training.comparisonResults.push(this._calcResult( training, ));
      }

      this._trainingInWorkout.editTrainingInWorkout(training)
        .then((res) => {
          console.log('Edit training in Workout succsessgully');
          console.log('training', training.lessTrainingResults, ' -- ', training.comparisonResults);
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

  private _calcResult(training: I_TrainingInWorkout, ): I_ComparisonResults {
    const comparisonResults: I_ComparisonResults[] = [];
    // currentRes: I_TrainingFormResults, prevRes: I_TrainingFormResults
    let comparisonResultsObj:I_ComparisonResults = {
      currentRepsAndWeights: 0,
      prevRepsAndWeights: 0,
      percentAndWeights: 0,
      trainingTmp: 0,
    }

      for (let j = 0; j < training.lessTrainingResults[0].weights.length; j++ ) {
        comparisonResultsObj  = {
          currentRepsAndWeights: training.lessTrainingResults[0].weights[j] * training.lessTrainingResults[0].reps[j],
          prevRepsAndWeights: training.lessTrainingResults[1].weights[j] * training.lessTrainingResults[1].reps[j],
          percentAndWeights: 0,
          trainingTmp: training.lessTrainingResults[0].trainingsdayTstamp,
        }
        comparisonResultsObj.percentAndWeights = this._calcPercent(comparisonResultsObj.currentRepsAndWeights, comparisonResultsObj.prevRepsAndWeights);
      }

      return comparisonResultsObj;
  }

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
