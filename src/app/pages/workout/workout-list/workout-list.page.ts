import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { map, Subscription } from 'rxjs';
import { IonAccordionGroup } from '@ionic/angular';
// service
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
// interface
import { I_Workout } from 'src/app/shared/interfaces/I_Workout';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.page.html',
  styleUrls: ['./workout-list.page.scss'],
})
export class WorkoutListPage implements OnInit {
  @ViewChild('accordionGroup', { static: true })
  accordionGroup!: IonAccordionGroup;

  protected workouts: I_Workout[] | undefined;
  private _workoutKey: string = '';
  private _workoutName: string = '';
  protected trainingsLengths: number[] = [];
  private _isDelWorkout: boolean = false; // Was delete workout pressed

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _workoutService: WorkoutService,
    private readonly _trainingInWorkoutService: TrainingInWorkoutService,
    private readonly _alertService: AlertService
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  /**
   *
   * @protected
   * @memberof WorkoutListPage
   *
   * @description
   * fetch all workouts and all trainings in workout
   *
   */
  private _fetchAllWorkout(): void {
    this._workoutService
      .fetchAll()
      .pipe(
        map((workout) => {
          workout?.map((w) => {
            if (w.key) {
              this._trainingInWorkoutService
                .fetchAllTrainingInWorkout(w.key)
                .subscribe((trainings) => {
                  this.trainingsLengths.push(trainings.length);
                });
            }
            return w;
          });
          return workout;
        })
      )
      .subscribe((workout) => {
        this.workouts = workout;
      });
  }

  /**
   *
   * @protected
   * @param workout
   * @memberof WorkoutListPage
   *
   * @description
   * create the forms and set the validators
   * redirect to the 'training-in-workout-form'
   */
  protected onInsertTraining(workout: I_Workout): void {
    this._router.navigateByUrl(`training-in-workout-form/${workout.key}`, {
      replaceUrl: true,
    });
  }

  /**
   *
   * @protected
   * @param workout
   * @memberof WorkoutListPage
   *
   * @description
   * redirect to the 'workout-edit'
   *
   */
  protected onEdit(workout: I_Workout): void {
    this._router.navigateByUrl(`workout-edit/${workout.key}?isEdit=true`, {
      replaceUrl: true,
    });
  }

  /**
   *
   * @protected
   * @param workout
   * @memberof WorkoutListPage
   *
   * @description
   * Opens a confirm field in which you must confirm whether the Workout is to be deleted
   *
   */
  protected onDeleteWorkout(workout: I_Workout): void {
    if (workout.key) {
      this._workoutKey = workout.key;
      this._workoutName = workout.name;
      this._isDelWorkout = true;
      this._alertService.showConfirm(
        'Workout löschen',
        `Möchtest du das Workout "${workout.name}" wirklich löschen?`,
        'warning'
      );

      const workoutConfirm: Subscription = this._alertService
        .getConfirmResult()
        .subscribe((res) => {
          if (res) {
            workoutConfirm.unsubscribe();
            this._delWorkout();
          }
        });
    }
  }

  /**
   *
   * @private
   * @memberof WorkoutListPage
   *
   * @description
   * delete a workout by key
   *
   */
  private _delWorkout(): void {
    this._workoutService
      .del(this._workoutKey)
      .then(() => {
        this._workoutKey = '';
        this._alertService.showToast(
          `Das Workout "${this._workoutName}" wurde gelöscht`
        );
      })
      .catch((error) => {
        console.error('Error', 'Workout konnte nicht gelöscht werden');
      });
  }

  /**
   *
   * @protected
   * @memberof WorkoutListPage
   *
   * @description
   * redirects to the Componete workout form to insert a new workout in the database
   *
   */
  protected onGoToAdd(): void {
    this._router.navigateByUrl('/workout-add', { replaceUrl: true });
  }

  /**
   *
   * @protected
   * @param workout
   * @memberof WorkoutListPage
   *
   * @description
   * increases the count in the workout
   * set the 'trainingsdayTstamps' from workout
   * redirect to "training-start-list"
   *
   */
  protected onGoStartWorkout(workout: I_Workout | undefined): void {
    if (workout) {
      workout.count = workout.count + 1;
      this._setTmp(workout);
      this._router.navigateByUrl(`training-start-list/${workout.key}`, {
        replaceUrl: true,
      });
    }
  }

  /**
   *
   * @private
   * @param workout
   * @memberof WorkoutListPage
   *
   * @description
   * set the 'trainingsdayTstamps' from workout
   * edit the workout in the db
   *
   */
  private _setTmp(workout: I_Workout): void {
    workout.trainingsdayTstamps.unshift({
      startDateTmp: Date.now(),
      endDateTmp: 0,
      workoutTime: 0,
      workoutTimeObj: {
        day: '0',
        hours: '0',
        minutes: '0',
        seconds: '0',
      },
    });
    this._workoutService
      .edit(workout)
      .then(() => {
        console.log('TMP gesetzt', workout.trainingsdayTstamps[0]);
      })
      .catch((error) => {
        console.error('TMP konnte nicht gesetzt werden ', error);
      });
  }

  /**
   *
   * @protected
   * @memberof WorkoutListPage
   *
   * @description
   * open the current accordion
   *
   */
  private _openCurrentAccorion() {
    const nativeEl = this.accordionGroup;
    const currentAccordion =
      this._route.snapshot.queryParamMap.get('accordion');
    if (nativeEl.value === currentAccordion) {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = currentAccordion;
    }
  }

  /**
   *
   * @protected
   * @memberof WorkoutListPage
   *
   * @description
   * fetch all workout
   * is in the _URL a parameter from 'accordion'
   * then set the current accordion
   * and open this
   *
   */
  private _initComponent(): void {
    this._fetchAllWorkout();

    if (this._route.snapshot.queryParamMap.has('accordion')) {
      // open the current accorion
      this._openCurrentAccorion();
    }
  }
}
