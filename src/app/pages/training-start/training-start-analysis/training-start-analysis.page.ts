import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
// Services
import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';
// interfaces
import {
  I_ComparisonResults,
  I_TrainingInWorkout,
} from 'src/app/shared/interfaces/I_TrainingInWorkout';
import { I_TotalValue, I_TrainingsdayTstamps, I_Workout } from 'src/app/shared/interfaces/I_Workout';
import { DateService } from 'src/app/shared/services/date/date.service';
import { I_TimeObj } from 'src/app/shared/interfaces/I_DateTime';

@Component({
  selector: 'app-training-start-analysis',
  templateUrl: './training-start-analysis.page.html',
  styleUrls: ['./training-start-analysis.page.scss'],
})
export class TrainingStartAnalysisPage implements OnInit {
  private _workoutKey: string | null = null;
  protected workout: I_Workout | null = null;
  protected trainings: I_TrainingInWorkout[] | null = null;
  protected totalValue: I_TotalValue | undefined;
  protected comparisonResults = [];
  protected workoutTime: I_TimeObj | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _workoutService: WorkoutService,
    private _trainingInWorkoutService: TrainingInWorkoutService,
    private _dateService: DateService,
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  protected getCurrentDate(): number {
    return this._dateService.getNowDatAsTstamp();
  }


  protected isPositive(): boolean {
    if (this.totalValue && (this.totalValue.totalResultAndNReps || this.totalValue.totalResultAndNReps >= 0) && (this.totalValue.prevTotalResultAndNReps || this.totalValue.prevTotalResultAndNReps) >= 0) {
      return this.totalValue?.totalResultAndNReps - this.totalValue?.prevTotalResultAndNReps >= 0;
    } else {
      return false;
    }
  }

  protected diffResult(currentResult: number | undefined, prevResult: number | undefined): number {
    let res: number = 0;
    if ( typeof currentResult == 'number' && typeof prevResult == 'number' ) {
      console.log('cu', currentResult, ' ')
      console.log('pr', prevResult, ' ')


      res = currentResult - prevResult;
    }
    return res;
  }

  private _fetchWorkoutByKey(): void {
    if (this._workoutKey) {
      this._workoutService.fetchByKey(this._workoutKey).subscribe({
        next: (workout) => {
          if (workout) {
            this.workout = workout;
            if (workout ) {
              if (workout.totalValue && workout.totalValue.length) {
                this.totalValue = workout.totalValue[0];
              }
              if ( workout.trainingsdayTstamps &&  workout.trainingsdayTstamps.length) {
                this.workoutTime = this._dateService.getTimeFromTstamp(workout.trainingsdayTstamps[0].workoutTime);
              }

            }

            console.log('workout', workout)
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

  private _initComponent() {
    if (this._route.snapshot.paramMap.has('key')) {
      this._workoutKey = this._route.snapshot.paramMap.get('key');
      this._fetchWorkoutByKey();
    }
  }
}
