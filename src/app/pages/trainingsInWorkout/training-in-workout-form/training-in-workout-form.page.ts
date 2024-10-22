import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

// pipe
import { UcfirstPipe } from 'src/app/shared/pipes/ucFirst/ucfirst.pipe';
// services
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';
import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
// interfaces
import { I_TrainingInWorkout } from 'src/app/shared/interfaces/I_TrainingInWorkout';
import { I_Workout } from 'src/app/shared/interfaces/I_Workout';

@Component({
  selector: 'app-training-in-workout-form',
  templateUrl: './training-in-workout-form.page.html',
  styleUrls: ['./training-in-workout-form.page.scss'],
})
export class TrainingInWorkoutFormPage implements OnInit {
  protected workoutName: string = '';
  protected workout: I_Workout | undefined;
  private _workoutKey: string = '-1';
  private training: I_TrainingInWorkout | undefined;
  protected headline: string = '';

  private _userId: string = window.sessionStorage.getItem('uid') ?? '-1';
  private _highestOrder: number = 0;
  protected _backUrl: string = 'trainings-in-workout-list';

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
    private readonly _trainingInWorkoutService: TrainingInWorkoutService
  ) {}

  ngOnInit() {
    this._initComponent();
  }


      /**
   *
   * @protected
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * fetch s workout by ID
   *
   */
  private _fetchWorkoutByKey(): void {
    this._workoutService
      .fetchByKey(this._workoutKey)
      .pipe(take(1))
      .subscribe({
        next: (workout) => {
          this.workout = workout;
        },
        error: (error) => {
          console.error('ERROR by fetchWorkoutByKey', error);
        },
        complete: () => {
          if (this.workout && this.workout.name) {
            this.workoutName = this.workout?.name;
            this.headline = `Training in "${this.workoutName}" ${
              this.isEdit ? 'bearbeiten' : 'einfügen'
            }`;
          }
        },
      });
  }

  /**
   *
   * @private
   * @param trainingKey
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * fetch training by key
   * by isEdit set the formcontrol values:
   * - training
   * - goalRepsStart
   * - goalRepsEnd
   * - isBodyWeight
   * - isWarmUp
   *
   */
  private _fetchTrainingByKey(trainingKey: string): void {
    this._trainingInWorkoutService
      .fetchTrainingByKey(this._workoutKey, trainingKey, this._userId)
      .pipe(take(1))
      .subscribe((training) => {
        this.training = training[0];
        this.trainingCtrl?.setValue(this.training.name);
        this.goalRepsStartCtrl?.setValue(this.training.goalRepsStart);
        this.goalRepsEndCtrl?.setValue(this.training.goalRepsEnd);
        this.bodyweightCtrl?.setValue(this.training.isBodyWeight);
        this.warmupCtrl?.setValue(this.training.isWarmUp);
      });
  }

      /**
   *
   * @protected
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * fetch all training from a workout
   *
   */
  private _getTrainingsByWorkoutKey(): void {
    if (this._workoutKey) {
      this._trainingInWorkoutService
        .fetchAllTrainingInWorkout(this._workoutKey)
        .subscribe((training) => {
          const trainingArr = training;
          this._highestOrder = trainingArr.length;
          // console.log('_highestOrder', this._highestOrder);
        });
    }
  }

      /**
   *
   * @protected
   * @returns I_TrainingInWorkout
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * create the object for the training in workout db
   *
   */
  private _createTrainingInWorkout(): I_TrainingInWorkout {
    const ucFirst = new UcfirstPipe();
    return {
      namespace: 'trainingInWorkout',
      key: '',
      workoutkey: this._workoutKey,
      workoutName: this.workoutName,
      isNegativeWeight: false,
      name: ucFirst.transform(this.trainingCtrl?.value),
      order: ++this._highestOrder,
      goalRepsStart: this.goalRepsStartCtrl?.value,
      goalRepsEnd: this.goalRepsEndCtrl?.value,
      globalSets: 3,
      count: 1,
      isBodyWeight: this.bodyweightCtrl?.value,
      userKey: this._userId,
      isWarmUp: this.warmupCtrl?.value,
      trainingResults: [],
      comparisonResults: [],
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
   * @protected
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
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
   * @private
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * create a new training in the db from form
   * and get the resault as message
   *
   */
  private _addTrainingsInWorkout(): void {
    const training = this._createTrainingInWorkout();
    if (this._trainingInWorkoutService.createTrainingInWorkout(training)) {
      this._alertService.showToast(
        `Training "${training.name}" wurde hinzugefügt.`,
        'middle',
        'success'
      );
      this._router.navigateByUrl(
        `${this._backUrl}/${this._workoutKey}?workoutName=${this.workoutName}`,
        {
          replaceUrl: true,
        }
      );
    } else {
      this._alertService.showAlert(
        'Error',
        `Training konnte nicht hinzugefügt werden`,
        'danger'
      );
    }
  }

  /**
   *
   * @protected
   * @param filter
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * edit the training, save this in the db and output a alert message
   * by successfully redirect to the 'workout-list' and open the current workout accordion
   *
   */
  protected _editTrainingInWorkout(): void {
    if (this.training) {
      this.training['name'] = this.trainingCtrl?.value;
      this.training['goalRepsStart'] = this.goalRepsStartCtrl?.value;
      this.training['goalRepsEnd'] = this.goalRepsEndCtrl?.value;
      this._trainingInWorkoutService
        .editTrainingInWorkout(this.training)
        .then(() => {
          this._alertService.showToast(
            `Training "${this.training?.name}" wurde geändert.`,
            'middle',
            'success'
          );
          if (
            this._route.snapshot.queryParamMap.has('url') &&
            this._route.snapshot.queryParamMap.get('url') == 'workoutList'
          ) {
            // redirect to 'workout-list' and open the current workout accordion
            const accordion =
              'workout' + this._route.snapshot.queryParamMap.get('index');
            this._router.navigateByUrl(`workout-list?accordion=${accordion}`, {
              replaceUrl: true,
            });
          } else {
            this._router.navigateByUrl(
              `${this._backUrl}/${this._workoutKey}?workoutName=${this.workoutName}`,
              {
                replaceUrl: true,
              }
            );
          }
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
   * @protected
   * @memberof AuthPage
   * @returns AbstractControl<any, any> | null
   *
   * @description
   * get the AbstractControl  "training"
   *
   */
  protected get trainingCtrl(): AbstractControl<any, any> | null {
    return this.trainingsInWorkoutFrom.get('training');
  }

  /**
   *
   * @protected
   * @memberof AuthPage
   * @returns AbstractControl<any, any> | null
   *
   * @description
   * get the AbstractControl  "goalRepsStart"
   *
   */
  protected get goalRepsStartCtrl(): AbstractControl<any, any> | null {
    return this.trainingsInWorkoutFrom.get('goalRepsStart');
  }

  /**
   *
   * @protected
   * @memberof AuthPage
   * @returns AbstractControl<any, any> | null
   *
   * @description
   * get the AbstractControl  "training"
   *
   */
  protected get goalRepsEndCtrl(): AbstractControl<any, any> | null {
    return this.trainingsInWorkoutFrom.get('goalRepsEnd');
  }

  /**
   *
   * @protected
   * @memberof AuthPage
   * @returns AbstractControl<any, any> | null
   *
   * @description
   * get the AbstractControl  "warmup"
   *
   */
  protected get warmupCtrl(): AbstractControl<any, any> | null {
    return this.trainingsInWorkoutFrom.get('warmup');
  }

  /**
   *
   * @protected
   * @memberof AuthPage
   * @returns AbstractControl<any, any> | null
   *
   * @description
   * get the AbstractControl  "bodyweight"
   *
   */
  protected get bodyweightCtrl(): AbstractControl<any, any> | null {
    return this.trainingsInWorkoutFrom.get('bodyweight');
  }

  /**
   *
   * @protected
   * @returns FormGroup
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * create the form "trainingsInWorkoutFrom"
   *
   */
  private _trainingsInWorkoutForm(): FormGroup {
    return this._fb.group({
      training: ['', [Validators.required]],
      goalRepsStart: [0],
      goalRepsEnd: [12, Validators.required],
      warmup: [false],
      bodyweight: [false],
    });
  }

  /**
   *
   * @private
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * is the url param "isEdit" exist then fetch training by key
   * load the workout by key
   *
   */
  private _initComponent(): void {
    this._workoutKey = this._route.snapshot.params['key'] ?? null;
    // if (this._route.snapshot.queryParamMap.has('trainingsLenth')) {
    //   this._highestOrder = this._route.snapshot.queryParams['trainingsLenth'];
    // } else {
    this._getTrainingsByWorkoutKey();
    // }

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
