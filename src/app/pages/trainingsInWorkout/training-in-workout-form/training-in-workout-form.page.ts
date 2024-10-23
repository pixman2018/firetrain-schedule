import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

// pipe
import { UcfirstPipe } from 'src/app/shared/pipes/ucFirst/ucfirst.pipe';
// data
import { CategoryArr } from 'src/app/shared/data/category';
// services
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';
import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { TrainingService } from 'src/app/shared/services/trainingService/training.service';
// interfaces
import { I_TrainingInWorkout } from 'src/app/shared/interfaces/I_TrainingInWorkout';
import { I_Workout } from 'src/app/shared/interfaces/I_Workout';
import { I_Data } from 'src/app/shared/interfaces/I_Data';
import { I_Training } from 'src/app/shared/interfaces/I_Training';

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
  protected trainingList: I_Training[] = [];
  protected trainingExistsObj: I_TrainingInWorkout | null = null;
  protected headline: string = '';

  // data
  protected categories: I_Data[] = CategoryArr;

  private _userId: string = window.sessionStorage.getItem('uid') ?? '-1';
  private _highestOrder: number = 0;
  protected _backUrl: string = 'trainings-in-workout-list';

  // form
  protected trainingsInWorkoutFrom: FormGroup = this._trainingsInWorkoutForm();
  protected categoryIdCtrl: FormControl = new FormControl();
  protected trainingSelectCtrl: FormControl = new FormControl();

  // flag
  protected isShowForm: boolean = false;
  protected isSubmit: boolean = false;
  protected isEdit: boolean = false;
  protected isProCVersion: boolean = false;
  protected isTrainingExist: boolean = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _alertService: AlertService,
    private readonly _workoutService: WorkoutService,
    private readonly _trainingInWorkoutService: TrainingInWorkoutService,
    private readonly _userService: UserService,
    private readonly _training: TrainingService
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
      .fetchByKey(this._route.snapshot.params['key'])
      .pipe(take(1))
      .subscribe({
        next: (workout) => {
          if (workout) {
            this.workout = workout[0];
          }
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
   * @protected
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * fetch training by category
   *
   */
  protected onFetchTrainingsByCategoryId(): void {
    const categoryId: string = this.categoryIdCtrl.value;
    this._training.fetchTrainingByCategory(categoryId).subscribe({
      next: (trainings) => {
        this.trainingList = trainings;
        const trainingName: string = this.trainingCtrl?.value;

        this.trainingList.forEach((train) => {
          if (train.name && train.name?.toLowerCase() == trainingName.toLowerCase()) {
            this.trainingSelectCtrl.setValue(train.key);
          }
        });
      },
      complete: () => {},
      error: (error) => {
        console.error('Error by fetch training by category Key', error);
      },
    });
  }

  /**
   *
   * @protected
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * sets the values of the selected training in the select box “trainingSelectCtrl”
   *
   */
  protected onSelectTraining(): void {
    const trainingKey: string = this.trainingSelectCtrl.value;
    if (trainingKey) {
      this.trainingList.forEach((training) => {
        if (training.key == trainingKey) {
          if (training) {
            if (training.name) {
              this._isTrainingExists(training.name);
            }
            this.trainingCtrl?.setValue(training.name);
            this.bodyweightCtrl?.setValue(training.isBodyWeight);
          }
        }
      });
    }
  }

    /**
   *
   * @protected
   * @param fitrainingNameter
   * @memberof TrainigInWorkoutComponent
   *
   * @description
   * sets the flags whether a workout already exists in the workouts in workout
   *
   */
  private _isTrainingExists(trainingName: string): void {
    this._trainingInWorkoutService.fetchTrainingByName(trainingName).subscribe({
      next: (training) => {
        if (training && training.length > 0) {
          this.isTrainingExist = true;
        } else {
          this.isTrainingExist = false;
        }
        this.trainingExistsObj = training[0];
      },
      complete: () => {},
      error: (error) => {
        console.error('Error by loading from trainining by name');
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

        if (this.isProCVersion) {
          this.categoryIdCtrl.setValue(this.training.categoryId);
          this.onFetchTrainingsByCategoryId();
        }
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
    const trainingObj: I_TrainingInWorkout = {
      namespace: 'trainingInWorkout',
      key: '',
      categoryId: this.categoryIdCtrl.value ?? '',
      trainingsRefKey: this.trainingSelectCtrl.value ?? '',
      workoutKeys: [],
      workoutName: this.workoutName,
      isNegativeWeight: false,
      name: ucFirst.transform(this.trainingCtrl?.value, true),
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
    trainingObj.workoutKeys.push(this._workoutKey);
    return trainingObj;
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
   * If a workout is already in a workout,
   * the current workout id is saved in workoutKeys
   *
   */
  private _addTrainingsInWorkout(): void {
    let training: I_TrainingInWorkout | null = null;
    if (this.isTrainingExist) {
      training = this.trainingExistsObj;
      training?.workoutKeys.push(this._workoutKey);
      if (training) {
        this._trainingInWorkoutService.editTrainingInWorkout(training)
          .then(() => {
            if (training) {
              this._successfullyAddTraining(training);
            }
          })
          .catch((error) => {
            this._errorAddTraining();
          })
      }

    } else {
      training = this._createTrainingInWorkout();
      if (training) {
        if (this._trainingInWorkoutService.createTrainingInWorkout(training)) {
          this._successfullyAddTraining(training);
        } else {
          this._errorAddTraining();
        }
      }
    }
  }

  /**
   *
   * @protected
   * @param training
   * @memberof TrainigInWorkoutComponent
   *
   * @description
   * output from successfully add trainig in workout
   *
   */
  private _successfullyAddTraining(training: I_TrainingInWorkout) {
    this._resetForm();
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
  }

  /**
   *
   * @protected
   * @memberof TrainigInWorkoutComponent
   *
   * @description
   * output from error add trainig in workout
   *
   */
  private _errorAddTraining() {
    this._alertService.showAlert(
      'Error',
      `Training konnte nicht hinzugefügt werden`,
      'danger'
    );
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
          this._resetForm();
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
   * @private
   * @memberof TrainingInWorkoutFormPage
   *
   * @description
   * reset the form and
   * - trainingSelectCtrl
   * - categoryIdCtrl
   *
   */
  private _resetForm(): void {
    this.trainingsInWorkoutFrom.reset();
    this.trainingSelectCtrl.setValue('');
    this.categoryIdCtrl.setValue('');
  }

  /**
   *
   * @protected
   * @memberof TrainingInWorkoutFormPage
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
   * @memberof TrainingInWorkoutFormPage
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
   * @memberof TrainingInWorkoutFormPage
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
   * @memberof TrainingInWorkoutFormPage
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
   * @memberof TrainingInWorkoutFormPage
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
    /*
    ****************************************
    is userId exist
    ****************************************
    */
    if (!this._userId || this._userId == null) {
      this._router.navigateByUrl(`/'auth}`, {
        replaceUrl: true,
      });
    }
    // get workout by key
    this._fetchWorkoutByKey();

    // isPro
    this._userService.getUserByKey(this._userId).subscribe((user) => {
      this.isProCVersion = Boolean(user?.isProVersion);
    });

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

    this._trainingInWorkoutService
      .fetchTrainingByName('Push Ups')
      .subscribe((t) => {
        console.log('t', t);
      });
  }
}
