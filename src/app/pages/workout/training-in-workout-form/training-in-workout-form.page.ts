import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { TrainingInWorkoutI } from 'src/app/shared/interfaces/TrainingInWorkoutI';
import { WorkoutI } from 'src/app/shared/interfaces/Workout';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';

@Component({
  selector: 'app-training-in-workout-form',
  templateUrl: './training-in-workout-form.page.html',
  styleUrls: ['./training-in-workout-form.page.scss'],
})
export class TrainingInWorkoutFormPage implements OnInit {
  protected workoutName: string = '';
  protected workout: WorkoutI | undefined;
  private _workoutKey: string = '-1';
  protected trainings: any[] = []; // TrainingInWorkoutI
  private _userId: string = window.sessionStorage.getItem('uid') ?? '-1';
  protected highestOrder: number = -1;

  // form
  protected trainingsInWorkoutFrom: FormGroup = this._trainingsInWorkoutForm();

  // flag
  protected isShowForm: boolean = false;
  protected isSubmit: boolean = false;
  protected isEdit: boolean = false;

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _fb: FormBuilder,
    private readonly _alertService: AlertService,
    private readonly _workoutService: WorkoutService
  ) {}

  ngOnInit() {
    this._initComponent();

    this._workoutService.fetchByKey(this._workoutKey).subscribe((res) => {
      console.log('workout', res);
    });
  }

  /**
   *
   * show the form for training
   *
   */
  protected onShowForm(): void {
    this.isShowForm = true;
  }

  /**
   *
   * fetch the workout by ID
   *
   */
  private _fetchWorkoutByKey(): void {
    this._workoutService.fetchByKey(this._workoutKey).subscribe((workout) => {
      this.workout = workout;
    });
  }

  /**
   *
   * fetch all trainings from workout
   *
   */
  private _fetchTrainings(): Promise<any> {
    return new Promise((resolve, reject) => {
      let result = [];
      this._workoutService
        .fetchAllTrainingInWorkout(this._workoutKey)
        .subscribe((training) => {
          this.trainings = training;
        });

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
      order: ++this.highestOrder,
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
    console.log(this.trainingsInWorkoutFrom.value);
    const training = this._createTrainingInWorkout();
    if (this._workoutService.createTrainingInWorkout(training)) {
      this._alertService.showAlert(
        'Training hinzugefügt',
        `${training.name} wurde hinzugefügt.`,
        'success'
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
    /*
    ****************************************
    read the query params and params
    ****************************************
    */
    this.workoutName = this._route.snapshot.queryParams['workoutName'] ?? null;
    this._workoutKey = this._route.snapshot.paramMap.get('key') ?? '-1';
    if (!this.workoutName || !this._workoutKey) {
      // TODO: Error Logger https://www.codemag.com/article/1711021/Logging-in-Angular-Applications
      console.error(
        'ERROR: ',
        this.workoutName + ' or ' + this._workoutKey + ' not exsist.'
      );
      this._router.navigateByUrl(`/'workout-list}`, {
        replaceUrl: true,
      });
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
      this._fetchTrainings();
    }
  }
}
