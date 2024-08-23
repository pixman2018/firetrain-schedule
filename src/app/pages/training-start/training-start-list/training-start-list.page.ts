import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { I_ComparisonResults, I_TrainingInWorkout } from 'src/app/shared/interfaces/I_TrainingInWorkout';
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
        console.log('workoput', workout);
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
    this.trainings.forEach((training) => {
      console.log('training', training);
      if (training.trainingResults[0]) {
        training.lessTrainingResults.unshift(training.trainingResults[0]);
        this._calcResult(training);
        this._trainingInWorkout
          .editTrainingInWorkout(training)
          .then(() => {
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
            console.error('training result not save.', error);
          });
      }
    });
  }

  private _calcResult(training: I_TrainingInWorkout): void {
    const comparisonResults: I_ComparisonResults[] = [];
    // if lessTrainingResults exists
    if (training.lessTrainingResults && training.lessTrainingResults.length) {
      for (let i = 0; i < training.lessTrainingResults[0].sets; i++ ) {
        // set default value in lessTrainingResults
        let lessTrainingResults: {[key: string]: number} = {
          weigth : 0,
          reps: 0,
        };
        if (training.lessTrainingResults[1] ) {
          lessTrainingResults['weigth'] = training.lessTrainingResults[1].weights[i];
        }
        if (training.lessTrainingResults[1] && training.lessTrainingResults[1].reps[i]) {
          lessTrainingResults['reps'] = training.lessTrainingResults[1].reps[i];
        }
      }
    }
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
