import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// service
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';
// interface
import { I_Workout } from 'src/app/shared/interfaces/I_Workout';
import { ActivatedRoute, Router } from '@angular/router';
import { UcfirstPipe } from 'src/app/shared/pipes/ucFirst/ucfirst.pipe';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.page.html',
  styleUrls: ['./workout-form.page.scss'],
})
export class WorkoutFormPage implements OnInit {

  protected workoutForm: FormGroup = this._createWorkoutForm();
  protected workout: I_Workout | undefined;
  // flag
  protected isSubmit: boolean = false;
  protected isEdit: boolean = false;
  protected ucFirstPipe = new UcfirstPipe();

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _alertService: AlertService,
    private readonly _workoutService: WorkoutService,
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  /**
   *
   * Go to the workout-list
   *
   */
  protected onToWorkout(): void {
    this._router.navigateByUrl(
      `workout-list`,
      {
        replaceUrl: true,
      }
    );
  }

    /**
   *
   * Receives the sent form
   * Checks whether the form is valid
   * continues with edit or add to the respective methods
   *
   */
    protected async onSubmitWorkout(): Promise<void> {
      this.isSubmit = true;
      if (this.workoutForm.valid) {
        if (this.isEdit) {
          this._submitEdit();
        } else {
          this._submitAdd();
        }
      }
    }

    /**
   *
   * if 'isEdit' is not set, the method 'onSubmitWorkout()' is redirected here
   * Creates the "Workout Object" and set this in the db
   * redirect to the "trainingsInWorkoutForm"
   * there you can insert workouts into the workout
   *
   */
  private _submitAdd(): void {
    const workout = this._createWorkoutObj();
    const newWorkoutId = this._workoutService.create(workout);
    if (newWorkoutId) {
      this._alertService.showToast('Neues Workout angelegt.', 'middle', 'success');
      this._router.navigateByUrl(`/trainings-in-workout-list/${newWorkoutId}?workoutName=${workout.name}`, {
        replaceUrl: true,
      });
      // this._workoutService.createTrainingInWorkout(newWorkoutId);
    } else {
      this._alertService.showToast('Workout konnt nicht angelegt werden.', 'middle', 'danger');
    }
  }

  private _submitEdit() {
    const workout = this.workout;
    if (workout) {
      workout['name'] = this.ucFirstPipe.transform(this.nameCtrl?.value);
      this._workoutService.edit(workout)
        .then(() => {
          this._alertService.showToast(
            `Workout "${this.workout?.name}" geändert`, 'middle', 'success'
          );
          this._router.navigateByUrl(`workout-list`, {
            replaceUrl: true,
          });
        })
        .catch((error) => {
          console.error('Error', 'by edit workout');
        })
    }
  }

      /**
   *
   * create the form "workoutForm"
   *
   * @returns FormGroup
   */
  private _createWorkoutForm(): FormGroup {
    return this._fb.group({
      name: ['', [Validators.required]],
    });
  }

  /**
   *
   * get the AbstractControl  "name"
   *
   * @return  AbstractControl<any, any> | null
   *
   */
    protected get nameCtrl(): AbstractControl<any, any> | null {
      return this.workoutForm.get('name');
    }

  /**
   *
   * creates the object "WorkoutI" and returns it
   *
   * @returns  WorkoutI
   *
   */
  private _createWorkoutObj(): I_Workout {
    const workout: I_Workout = {
      namespace: 'workout',
      name: this.ucFirstPipe.transform(this.nameCtrl?.value),
      userId: window.sessionStorage.getItem('uid')!,
      count: 0,
      // trainings: [],
      trainingsdayTstamps: [],
      isArchiv: false,
      folder: '',
      LengthOfTrainings: [],
      calorieConsumptions: [],
      totalValue: [],
      created: Date.now(),
      updated: Date.now(),
    };
    return workout;
  }

  private _initComponent(): void {
    const isEdit: boolean | null = Boolean(this._route.snapshot.queryParamMap.get('isEdit'));
    if (this._route.snapshot.queryParamMap.has('isEdit')) {
        if (isEdit) {
          this.isEdit = isEdit;
        }
        const key: string | null  = this._route.snapshot.paramMap.get('key');
        if (key) {
          this._workoutService.fetchByKey(key)
            .subscribe((workout) => {
              this.workout = workout;
              this.nameCtrl?.setValue(workout?.name);
            });
        }
    }
  }
}
