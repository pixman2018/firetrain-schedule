import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { I_TrainingInWorkout, I_TrainingResults } from '../../interfaces/I_TrainingInWorkout';
import { BehaviorSubject, first, firstValueFrom, map, Observable, Subscription } from 'rxjs';
import { TrainingInWorkoutService } from '../../services/trainingInWorkout/training-in-workout.service';
import { TrainingsInWorkoutListPageRoutingModule } from 'src/app/pages/trainingsInWorkout/trainings-in-workout-list/trainings-in-workout-list-routing.module';
import { DateService } from '../../services/date/date.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-start-add',
  templateUrl: './training-start-add.component.html',
  styleUrls: ['./training-start-add.component.scss'],
})
export class TrainingStartAddComponent implements OnInit {
  @Input() trainingKey: string | undefined;
  @Input() workoutKey: string  | undefined;
  // @Input() isFirst: boolean = false;
  protected training: I_TrainingInWorkout | null = null;
  private actionCtrlObs$: Subscription | undefined;

  // form
  protected resultForm: FormGroup = this._createForm();
  protected sets: number = 3;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _dateService: DateService,
    private _trainingInWorkout: TrainingInWorkoutService,
  ) {}

  ngOnInit() {
    this._initComponent();
  }


    /**
   *
   * gets all trainings from the current workout
   *
   * @param workoutKey
   *
   */
    private _fetchTrainingInWorkout() {
      if (this.trainingKey && this.workoutKey) {
        this._trainingInWorkout.fetchTrainingByKey(this.workoutKey, this.trainingKey)
        .pipe(
          first(),
          map((training) => {
            return training[0];
          }),
        )
        .subscribe((training) => {
          this.training = training;
        });
      }
    }

  /**
   *
   * get the result from actionCtrl as Observable
   * from the training start list page
   *
   * this string sends the result of the add or remove button
   *
   * @returns the result from actionCtrl
   *
   */
  // private _getActionCtrlAsObservable(): Observable<string> {
  //   return this.actionCtrl$.asObservable();
  // }

  protected onChanceValue(index: number) {

    if (this.getWeightCtrl(index)?.valid && this.getRepsCtrl(index)?.valid) {
      this._updateResult(index);
    }
  }

  protected onInsertResult(event: any, index: number) {
    if (this.itemControls.at(index).valid) {
      this._updateResult(index);
    } else {
      this.getDoneCtrl(index)?.setValue(false);
    }
  }

  protected _updateResult(index: number) {
    if (!this.training) {
      this._router.navigateByUrl(`/workout-list`, {
        replaceUrl: true,
      });
    }
    for (let i=0; i < this.itemControls.length; i++){
      console.log('value', this.getWeightCtrl(i)?.value)
    }


    const resultObj: I_TrainingResults = {
      trainingsdayTstamp: this._dateService.getNowDatAsTstamp(),
      sets: this.sets, // change by finish workout
      goalRepsStart: this.training?.goalRepsStart ?? 8, // goalRepsStart default 8
      goalRepsEnd: this.training?.goalRepsEnd ?? 12, // goalRepsEnd defauilt 12
      weights: [],
      reps: [],
      negativeReps: [],
      note: '',
    };

    this.itemControls.controls.forEach((value, index) => {
      if (this.getWeightCtrl(index)?.value != '') {
        resultObj.weights.push(this.getWeightCtrl(index)?.value);
        resultObj.reps.push(this.getRepsCtrl(index)?.value);
        resultObj.negativeReps.push(this.getNRepsCtrl(index)?.value);
        resultObj.sets = index + 1;
      }
    });

    if (this.training?.trainingResults ) {
      if (this.training?.trainingResults.length && this.training?.trainingResults[0].trainingsdayTstamp == this._dateService.getNowDatAsTstamp()) {
        this.training.trainingResults[0] = resultObj;
      } else {
        this.training?.trainingResults.unshift(resultObj);
      }
    }

    if (this.training) {
      console.log('training', this.training);
      this._trainingInWorkout.editTrainingInWorkout(this.training)
      .then(() => {
          console.log(this.training?.trainingResults);
      })
      .catch(error => {
        console.error('training result not save.', error);
      });
    }
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
   * create the from
   *
   * @returns formgroup
   */
  private _createForm(): FormGroup {
    return this._fb.group({
      result: this._fb.array([]),
    });
  }

  /**
   *
   * create the training result form group
   *
   * @returns formgroup
   */
  private _createFormControls(): FormGroup {
    return this._fb.group({
      weight: ['', [Validators.required]],
      reps: ['', [Validators.required]],
      nreps: [''],
      done: [false, [Validators.requiredTrue]],
    });
  }

  /**
   * Helper method to get the 'items' FormArray
   */
  get itemControls(): FormArray {
    return this.resultForm.get('result') as FormArray;
  }

  /**
   *
   * get the FormArray  "weight"
   *
   * @return  FormArray
   *
   */
  protected getWeightCtrl(index: number): AbstractControl<any, any> | null {
    const ctrl = this.itemControls.controls.at(index)?.get('weight');
    return ctrl ? ctrl : null;
  }

  /**
   *
   * get the FormArray  "reps"
   *
   * @return  FormArray
   *
   */
  protected getRepsCtrl(index: number): AbstractControl<any, any> | null {
    const ctrl = this.itemControls.controls.at(index)?.get('reps');
    return ctrl ? ctrl : null;
  }

  /**
   *
   * get the FormArray  "negative reps"
   *
   * @return  FormArray
   *
   */
  protected getNRepsCtrl(index: number): AbstractControl<any, any> | null {
    const ctrl = this.itemControls.controls.at(index)?.get('nreps');
    return ctrl ? ctrl : null;
  }

  /**
   *
   * get the FormArray  "done"
   *
   * @return  FormArray
   *
   */
  protected getDoneCtrl(index: number): AbstractControl<any, any> | null {
    const ctrl = this.itemControls.controls.at(index)?.get('done');
    return ctrl ? ctrl : null;
  }

  /**
   *
   * adds a fromgroup from the "_createFormControls" method to the form
   *
   */
  protected addTrainingGoal(): void {
    const items = this.itemControls as FormArray;
    items.push(this._createFormControls());
  }

  /**
   *
   * remove a fromgroup from the "_createFormControls" method to the form
   *
   * @param index
   */
  protected removeTrainingGoal() {
    const items = this.itemControls as FormArray;
    items.removeAt(this.itemControls.length - 1);
  }

  /**
   *
   * Subscribes to the Observable from the "_getActionCtrlAsObservable" method
   * and executes either the "_addTrainingGoal" or "_removeTrainingGoal" method.
   * Depending on the result of "actionCtrl"
   *
   * creates the number of formGroups in the formarray, in the size of "sets"
   *
   */
  private _initComponent() {
    this._fetchTrainingInWorkout()

    for (let i = 0; i < this.sets; i++) {
      this.itemControls.push(this._createFormControls());
    }
  }
}
