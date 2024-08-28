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
import { I_Workout } from 'src/app/shared/interfaces/I_Workout';
import { DateService } from 'src/app/shared/services/date/date.service';

@Component({
  selector: 'app-training-start-analysis',
  templateUrl: './training-start-analysis.page.html',
  styleUrls: ['./training-start-analysis.page.scss'],
})
export class TrainingStartAnalysisPage implements OnInit {
  private _workoutKey: string | null = null;
  protected workout: I_Workout | null = null;
  protected trainings: I_TrainingInWorkout[] | null = null;


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

  private _fetchWorkoutByKey(): void {
    if (this._workoutKey) {
      this._workoutService.fetchByKey(this._workoutKey).subscribe({
        next: (workout) => {
          if (workout) {
            this.workout = workout;
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
        .pipe(
          map((t) => {
            t.map((training) => {


              return training;
            });

            return t;
          })
        )
        .subscribe((training) => {
          this.trainings = training;

          console.log('training', training);
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
