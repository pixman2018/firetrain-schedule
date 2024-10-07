import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  map, Observable } from 'rxjs';

// Services
import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';
import { DateService } from 'src/app/shared/services/date/date.service';
// interfaces
import {
  I_TrainingInWorkout,
} from 'src/app/shared/interfaces/I_TrainingInWorkout';
import { I_TotalValue, I_Workout } from 'src/app/shared/interfaces/I_Workout';

@Component({
  selector: 'app-training-start-analysis',
  templateUrl: './training-start-analysis.page.html',
  styleUrls: ['./training-start-analysis.page.scss'],
})
export class TrainingStartAnalysisPage implements OnInit {

  protected workout: I_Workout | null = null;
  protected trainings: I_TrainingInWorkout[] | null = null;
  protected totalValue: I_TotalValue | undefined;
  protected showResultIndex: number = 0;
  // show the next or previous result to the currenr result
  protected showResultPrev: boolean = false;
  protected showResultNext: boolean = false;

  private _workoutKey: string | null = null;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _workoutService: WorkoutService,
    private _trainingInWorkoutService: TrainingInWorkoutService,
    private _dateService: DateService,
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  /**
   *
   * @description
   * show or hidden the previous or next result
   *
   * @param direction
   */
  protected onShowMore(direction: 'prev' | 'next'): void {
    if (direction == 'prev') {
      this.showResultPrev = !this.showResultPrev;
    } else if (direction == 'next') {
      this.showResultNext = ! this.showResultNext;
    }
  }

  /**
   *
   * @description
   * get the diff from current and previous result
   *
   * @param current
   * @param prev
   * @returns diff
   */
  protected getDiff(current: number | undefined, prev: number | undefined): number {
    let res = 0;
    if (!prev) {
      prev = 0;
    }
    if (current && prev >= 0) {
      res = current - prev;
    }
    return res;
  }

  /**
   *
   * @description
   * fetches the wokout using its Key.
   * stores the total value in 'totalValue' property and the time object in “workoutTime”
   *
   * By complete fetch the trainings from this workout
   *
   */
  private _fetchWorkoutByKey(): void {
    if (this._workoutKey) {
      this._workoutService.fetchByKey(this._workoutKey)
        .pipe(
          map(workout => {
            console.log('map', workout)
            if (workout) {
              workout['workoutTime'] = this._dateService.getTimeFromTstamp(workout.trainingsdayTstamps[this.showResultIndex].workoutTime)
            }
            return workout;
          })
        )
        .subscribe({
          next: (workout) => {
            if (workout) {
              this.workout = workout;
              console.log('workout', workout)
              if (workout.totalValue && workout.totalValue.length) {
                this.totalValue = workout.totalValue[this.showResultIndex];
              }
            }
          },
          error: (error) => {
            console.error('Can not fetch Workout by key.', error);
          },
          complete: () => {
            this._fetchTrainingsByKey();
          },
      });
    }
  }

  /**
   *
   * @description
   * checks whether the current result is higher than the previous result
   *
   * @returns result
   */
    protected isPositive(): boolean {
      if (this.totalValue && (this.totalValue.totalResultAndNReps || this.totalValue.totalResultAndNReps >= 0) && (this.totalValue.prevTotalResultAndNReps || this.totalValue.prevTotalResultAndNReps) >= 0) {
        return this.totalValue?.totalResultAndNReps - this.totalValue?.prevTotalResultAndNReps >= 0;
      } else {
        return false;
      }
    }

  /**
   *
   * @description
   * gets the training from this workout
   *
   */
  private _fetchTrainingsByKey(): void {
    if (this._workoutKey) {
      const trainings$: Observable<I_TrainingInWorkout[]> =
        this._trainingInWorkoutService.fetchAllTrainingInWorkout(
          this._workoutKey
        );
      trainings$
        .subscribe((training) => {
          if (training) {
            this.trainings = training;
          }
        });
    }
  }

  /**
   *
   * @description
   * sets the is the workout key if this is not available then redirect to “Workout-list”
   *
   */
  private _initComponent() {
    if (this._route.snapshot.paramMap.has('key')) {
      this._workoutKey = this._route.snapshot.paramMap.get('key');
      this._fetchWorkoutByKey();
    } else {
      this._router.navigateByUrl(
        `/workout-list`,
        {
          replaceUrl: true,
        }
      );
    }
  }
}
