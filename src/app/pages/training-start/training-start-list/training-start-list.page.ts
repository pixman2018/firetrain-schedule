import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
// import { BehaviorSubject } from 'rxjs';
import {  TrainingInWorkoutI } from 'src/app/shared/interfaces/TrainingInWorkoutI';
import { WorkoutI } from 'src/app/shared/interfaces/Workout';
import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';

@Component({
  selector: 'app-training-start-list',
  templateUrl: './training-start-list.page.html',
  styleUrls: ['./training-start-list.page.scss'],
})
export class TrainingStartListPage implements OnInit, OnDestroy {

  // protected actionCtrlSub$ = new BehaviorSubject<string>('');
  protected workout: WorkoutI | undefined;
  protected trainings: TrainingInWorkoutI[] = [];


  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _workoutService: WorkoutService,
    private _trainingInWorkout: TrainingInWorkoutService,
  ) { }

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
    this._workoutService.fetchByKey(workoutKey)
      .subscribe({
        next: (workout => {
          console.log('workoput', workout)
          this.workout = workout;
        }),
        error: (error => console.error('ERROR, Workout not found', error)),
        complete: () => {
          this._fetchAllTrainingsInWorkout(workoutKey);
        }
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
    this._trainingInWorkout.fetchAllTrainingInWorkout(workoutKey)
      .subscribe((training) => {
        this.trainings = training;
      });
  }

  /**
   *
   * sets the action from the action button into a subject
   *
   * @param action the passed action for the fromarray ('add', 'remove')
   *
   */
  // protected onActionTrainingGoal(action: string): void {
  //   this.actionCtrlSub$.next(action);
  // }

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
