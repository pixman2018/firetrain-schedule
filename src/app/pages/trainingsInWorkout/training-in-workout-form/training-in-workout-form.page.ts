import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';

// services
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';
// interfaces
import { TrainingInWorkoutI } from 'src/app/shared/interfaces/TrainingInWorkoutI';
import { WorkoutI } from 'src/app/shared/interfaces/Workout';
import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-training-in-workout-form',
  templateUrl: './training-in-workout-form.page.html',
  styleUrls: ['./training-in-workout-form.page.scss'],
})
export class TrainingInWorkoutFormPage implements OnInit {

  protected workoutName: string = '';
  protected workout: WorkoutI | undefined;
  private _workoutKey: string = '-1';
  private training: TrainingInWorkoutI | undefined;
  protected headline: string = '';

  private _userId: string = window.sessionStorage.getItem('uid') ?? '-1';
  private _highestOrder: number = 0;

  // form
  protected trainingsInWorkoutFrom: FormGroup = this._trainingsInWorkoutForm();

  // flag
  protected isShowForm: boolean = false;
  protected isSubmit: boolean = false;
  protected isEdit: boolean = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _alertService: AlertService,
    private readonly _workoutService: WorkoutService,
    private readonly _trainingInWorkoutService: TrainingInWorkoutService,
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  /**
   *
   * fetch the workout by ID
   *
   */
  private _fetchWorkoutByKey(): void {
    this._workoutService.fetchByKey(this._workoutKey)
      .pipe(
        take(1)
      ).subscribe({
        next: (workout => {
          this.workout = workout;
        }),
        error: (error => {
          console.error('ERROR by fetchWorkoutByKey', error);
        }),
        complete: () => {
          if (this.workout && this.workout.name) {
            this.workoutName = this.workout?.name;
            this.headline = `Training in Workout: "${this.workoutName}" ${this.isEdit ? 'bearbeiten' : 'einfügen'}`;
          }
        }
      })

  }

  private _fetchTrainingByKey(trainingKey: string) {
    this._trainingInWorkoutService.fetchTrainingByKey(this._workoutKey, trainingKey)
      .pipe(
        take(1)
      )
      .subscribe(training => {
        this.training = training[0];
        this.trainingCtrl?.setValue(this.training.name);
        this.goalRepsStartCtrl?.setValue(this.training.goalRepsStart);
        this.goalRepsEndCtrl?.setValue(this.training.goalRepsEnd);
      });
  }


  /**
   *
   * create the object for the training in workout db
   *
   * @returns training obj
   *
   */
  private _createTrainingInWorkout(): TrainingInWorkoutI {
    return {
      namespace: 'trainingInWorkout',
      key: '',
      workoutkey: this._workoutKey,
      workoutName: this.workoutName,
      isNegativeWeight: false,
      name: this.trainingCtrl?.value,
      order: ++this._highestOrder,
      goalRepsStart: this.goalRepsStartCtrl?.value,
      goalRepsEnd: this.goalRepsEndCtrl?.value,
      count: 1,
      userKey: this._userId,
      isWarmUp: false,
      trainingResults: [],
      lessTrainingResults: [],
      created: Date.now(),
      updated: Date.now(),
    };
  }

  /*
   ********************************************************************************
   *****
   ***
   * Form
   ***
   *****
   ********************************************************************************
   */
  /**
   *
   * Receives the sent form
   * Checks whether the form is valid
   * Creates or updates the workout in "Workouts in Workout"
   * Sets the workouts in the workout
   *
   */
  protected onSubmitTrainingsInWorkout(): void {
    this.isSubmit = true;
    if (this.trainingsInWorkoutFrom.valid) {
      if (this.isEdit) {
        this._editTrainingInWorkout();
      } else {
        this._addTrainingsInWorkout();
      }
    }
  }

  /**
   *
   * add a training in traingInWorkout
   *
   */
  private _addTrainingsInWorkout(): void {

    const training = this._createTrainingInWorkout();
    if (this._trainingInWorkoutService.createTrainingInWorkout(training)) {
      this._alertService.showToast(
        `Training "${training.name}" wurde hinzugefügt.`,
        'top',
        'success'
      );
      this._router.navigateByUrl(`trainings-in-workout-list/${this._workoutKey}`, {
        replaceUrl: true,
      });
    } else {
      this._alertService.showAlert(
        'Error',
        `Training konnte nicht hinzugefügt werden`,
        'danger'
      );
    }
  }

  protected _editTrainingInWorkout() {
    if (this.training) {
      this.training['name'] = this.trainingCtrl?.value;
      this.training['goalRepsStart'] = this.goalRepsStartCtrl?.value;
      this.training['goalRepsEnd'] = this.goalRepsEndCtrl?.value;
      this._trainingInWorkoutService.editTrainingInWorkout(this.training)
        .then(() => {
          this._alertService.showToast(
            `Training "${this.training?.name}" wurde geändert.`,
            'top',
            'success'
          );
          this._router.navigateByUrl(`trainings-in-workout-list/${this._workoutKey}`, {
            replaceUrl: true,
          });
        })
        .catch(() => {
          this._alertService.showAlert(
            'Error',
            `Training konnte nicht geändert werden`,
            'danger'
          );
        });
    }
  }

  /**
   *
   * get the AbstractControl  "training"
   *
   * @return  AbstractControl<any, any> | null
   *
   */
  protected get trainingCtrl(): AbstractControl<any, any> | null {
    return this.trainingsInWorkoutFrom.get('training');
  }

  /**
   *
   * get the AbstractControl  "goalRepsStart"
   *
   * @return  AbstractControl<any, any> | null
   *
   */
  protected get goalRepsStartCtrl(): AbstractControl<any, any> | null {
    return this.trainingsInWorkoutFrom.get('goalRepsStart');
  }

  /**
   *
   * get the AbstractControl  "training"
   *
   * @return  AbstractControl<any, any> | null
   *
   */
  protected get goalRepsEndCtrl(): AbstractControl<any, any> | null {
    return this.trainingsInWorkoutFrom.get('goalRepsEnd');
  }

  /**
   *
   * create the form "trainingsInWorkoutFrom"
   *
   * @returns FormGroup
   */
  private _trainingsInWorkoutForm(): FormGroup {
    return this._fb.group({
      training: ['', [Validators.required]],
      goalRepsStart: [0],
      goalRepsEnd: [12, Validators.required],
    });
  }

  private _initComponent(): void {
    this._workoutKey = this._route.snapshot.params['key'] ?? null;
    this._highestOrder = this._route.snapshot.queryParams['trainingsLenth'];
    if (this._route.snapshot.queryParamMap.has('isEdit')) {
      this.isEdit = true;
      this._fetchTrainingByKey(this._route.snapshot.queryParams['trainingKey']);
    }
    /*
    ****************************************
    is userId exist
    ****************************************
    */
    if (!this._userId || this._userId == null) {
      this._router.navigateByUrl(`/'auth}`, {
        replaceUrl: true,
      });
    } else {
      this._fetchWorkoutByKey();
    }
  }
}
