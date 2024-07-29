import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// service
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';
// interface
import { WorkoutI } from 'src/app/shared/interfaces/Workout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.page.html',
  styleUrls: ['./workout-form.page.scss'],
})
export class WorkoutFormPage implements OnInit {

  protected workoutForm: FormGroup = this._createWorkoutForm();

  // flag
  protected isSubmit: boolean = false;
  protected isEdit: boolean = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _alertService: AlertService,
    private readonly _helperService: HelperService,
    private readonly _workoutService: WorkoutService,
  ) {}

  ngOnInit() {}

  /**
   *
   * Go to the prev page
   *
   */
  protected onClickBack(): void {
    this._helperService.backBtn();
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
          // this._submitEdit();
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
      this._router.navigateByUrl(`/training-in-workout-form/${newWorkoutId}?workoutName=${workout.name}`, {
        replaceUrl: true,
      });
      // this._workoutService.createTrainingInWorkout(newWorkoutId);
    } else {
      this._alertService.showToast('Workout konnt nicht angelegt werden.', 'middle', 'danger');
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
    // this.isEdit ? this.workout?.name : ''
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
  private _createWorkoutObj(): WorkoutI {
    const workout: WorkoutI = {
      namespace: 'workout',
      name: this.nameCtrl?.value,
      userId: window.sessionStorage.getItem('uid')!,
      count: 0,
      // trainings: [],
      trainingsdayTstamps: [],
      isArchiv: false,
      folder: '',
      LengthOfTrainings: [],
      calorieConsumptions: [],
      totalValue: {
        weightsTotal: 0,
        repsTotal: 0,
        setsTotal: 0,
        totalValue: 0,
      },
      created: Date.now(),
      updated: Date.now(),
    };
    return workout;
  }
}
