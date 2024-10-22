import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { first, map } from 'rxjs';

// services
import { TrainingInWorkoutService } from '../../services/trainingInWorkout/training-in-workout.service';
import { DateService } from '../../services/date/date.service';
// interfaces
import {
  I_TrainingInWorkout,
  I_TrainingResults,
} from '../../interfaces/I_TrainingInWorkout';
import { I_Settings } from '../../interfaces/I_User';

@Component({
  selector: 'app-training-start-add',
  templateUrl: './training-start-add.component.html',
  styleUrls: ['./training-start-add.component.scss'],
})
export class TrainingStartAddComponent implements OnInit {
  @Input() trainingKey: string | undefined;
  @Input() workoutKey: string | undefined;

  protected training: I_TrainingInWorkout | null = null;
  protected _userKey: string = '-1';

  // form
  protected resultForm: FormGroup = this._createForm();
  protected sets: number = 3;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _dateService: DateService,
    private readonly _trainingInWorkout: TrainingInWorkoutService
  ) {}

  ngOnInit() {
    this._initComponent();
  }

     /**
   *
   * @protected
   * @memberof TrainingStartAddComponent
   *
   * @description
   * gets all trainings from the current workout
   *
   */
  private _fetchTrainingInWorkout():void  {
    if (this.trainingKey && this.workoutKey) {
      this._trainingInWorkout
        .fetchTrainingByKey(this.workoutKey, this.trainingKey, this._userKey)
        .pipe(
          first(),
          map((training) => {
            return training[0];
          })
        )
        .subscribe({
          next: (training) => {
            this.training = training;
          },
          error: (error) => {
            console.error('Can not loading training', error);
          },
          complete: () => {
            this._createSets();
          },
        });
    }
  }

  /**
   *
   * @protected
   * @param index index from formArray
   * @description
   * sets the values of the training when changing weight or rep if both are valid
   *
   */
  // TODO: by chance from weight, reps or nreps after isDone
  protected onChanceValue(index: number) {
    if (this.getWeightCtrl(index)?.valid && this.getRepsCtrl(index)?.valid) {
      // this._updateResult(index);
      //
    }
  }

  /**
   *
   * @protected
   * @param index index from formArray
   * @description
   * is executed when the “done” checkbox is clicked.
   * If the form is valid, the “_updateResult” method is called,
   * otherwise the “done” checkbox is set to false
   */
  protected onInsertResult(index: number) {
    if (this.itemControls.at(index).valid) {
      this._updateResult(index);
    } else {
      this.getDoneCtrl(index)?.setValue(false);
    }
  }

      /**
   *
   * @protected
   * @memberof TrainingStartAddComponent
   *
   * @description
   * Sets the values for the “resultObj” object and inserts them into the training
   *
   */
  protected _updateResult(currentIndex: number): void {
    if (!this.training) {
      this._router.navigateByUrl(`/workout-list`, {
        replaceUrl: true,
      });
    }
    // Fill 'resultObj' with static values
    let resultObj: I_TrainingResults | null = null;
    // create a default result Object
    if (
      this._dateService.getNowDatAsTstamp() ==
      this.training?.trainingResults[0].trainingsdayTstamp
    ) {
      resultObj = this.training.trainingResults[0];
      resultObj.weights = [];
      resultObj.reps = [];
      resultObj.negativeReps = [];
    } else {
      resultObj = this._createDefaultResultObj();
    }

    resultObj.trainingsdayTstamp = this._dateService.getNowDatAsTstamp();

    // if available then copy deb “tmp” from “trainingResults” into the “resultObj” object
    if (this.training?.trainingResults[0]?.tmp) {
      resultObj.tmp = this.training?.trainingResults[0].tmp;
    }
    resultObj.tmp.push(Date.now());

    // set the training results
    this.itemControls.controls.forEach((value, index) => {
      if (this.getWeightCtrl(index)?.value != '') {
        resultObj.weights.push(this.getWeightCtrl(index)?.value);
        resultObj.reps.push(this.getRepsCtrl(index)?.value);
        // If the optional value 'negReps' is not set, it is assigned the value 0 in the database
        if (this.getNRepsCtrl(index)?.value == '') {
          resultObj.negativeReps.push(0);
        } else {
          resultObj.negativeReps.push(this.getNRepsCtrl(index)?.value);
        }
        resultObj.sets = index + 1;
      }
    });

    if (this.training?.trainingResults) {
      if (
        this._dateService.getNowDatAsTstamp() ==
        this.training?.trainingResults[0].trainingsdayTstamp
      ) {
        this.training.trainingResults[0] = resultObj;
      } else {
        this.training.trainingResults.unshift(resultObj);
      }
    }
    if (this.training) {
      this._trainingInWorkout
        .editTrainingInWorkout(this.training)
        .then(() => {
          console.log('update trainig result');
        })
        .catch((error) => {
          console.error('training result not save.', error);
        });
    }
  }

  /**
   *
   * @private
   * @param isDeafult
   * @returns resultObj
   * @description
   * create a default object for the result object
   *
   */
  private _createDefaultResultObj(
    isDeafult: boolean = false
  ): I_TrainingResults {
    const resultObj: I_TrainingResults = {
      trainingsdayTstamp: 0,
      sets: this.sets, // change by finish workout
      goalRepsStart: this.training?.goalRepsStart ?? 8, // goalRepsStart default 8
      goalRepsEnd: this.training?.goalRepsEnd ?? 12, // goalRepsEnd defauilt 12
      weights: [],
      reps: [],
      negativeReps: [],
      note: '',
      tmp: [],
    };

    if (isDeafult) {
      for (let i = 0; i < this.sets; i++) {
        resultObj.weights.push(0);
        resultObj.reps.push(0);
        resultObj.negativeReps.push(0);
      }
    }
    return resultObj;
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
   * @private
   * @returns formgroup
   *
   * @description
   * create the from
   *
   */
  private _createForm(): FormGroup {
    return this._fb.group({
      result: this._fb.array([]),
    });
  }

  /**
   *
   * @private
   * @param isDeafult
   * @returns formgroup
   *
   * @description
   * create the training result form group
   *
   */
  private _createFormControls(): FormGroup {
    return this._fb.group({
      weight: ['', [Validators.required]],
      reps: ['', [Validators.required]],
      nreps: [''],
      done: [false, [Validators.requiredTrue]],
    });
  }

  /*
   ********************************************************************************
   * Helper method to get the 'items' FormArray
   ********************************************************************************
   */

  /**
   *
   * @protected
   * @returns FormArray
   *
   * @description
   * get the formcontrol "result"
   *
   */
  protected get itemControls(): FormArray {
    return this.resultForm.get('result') as FormArray;
  }

  /**
   *
   * @protected
   * @returns FormArray
   *
   * @description
   * get the FormArray  "weight"
   *
   */
  protected getWeightCtrl(index: number): AbstractControl<any, any> | null {
    const ctrl = this.itemControls.controls.at(index)?.get('weight');
    return ctrl ? ctrl : null;
  }

  /**
   *
   * @protected
   * @returns FormArray
   *
   * @description
   * get the FormArray  "reps"
   *
   */
  protected getRepsCtrl(index: number): AbstractControl<any, any> | null {
    const ctrl = this.itemControls.controls.at(index)?.get('reps');
    return ctrl ? ctrl : null;
  }

  /**
   *
   * @protected
   * @returns FormArray
   *
   * @description
   * get the FormArray  "negative reps"
   *
   */
  protected getNRepsCtrl(index: number): AbstractControl<any, any> | null {
    const ctrl = this.itemControls.controls.at(index)?.get('nreps');
    return ctrl ? ctrl : null;
  }

  /**
   *
   * @protected
   * @returns FormArray
   *
   * @description
   * get the FormArray  "done"
   *
   */
  protected getDoneCtrl(index: number): AbstractControl<any, any> | null {
    const ctrl = this.itemControls.controls.at(index)?.get('done');
    return ctrl ? ctrl : null;
  }

  /**
   *
   * @protected
   *
   * @description
   * adds a fromgroup from the "_createFormControls" method to the form
   *
   */
  protected addTrainingGoal(): void {
    const items = this.itemControls as FormArray;
    items.push(this._createFormControls());
  }

  /**
   *
   * @protected
   * @param index
   * index from form array
   * @description
   * remove a fromgroup from the "_createFormControls" method to the form
   *
   */
  protected removeTrainingGoal(): void {
    const items = this.itemControls as FormArray;
    items.removeAt(this.itemControls.length - 1);
  }

  /**
   *
   * @private
   *
   * @description
   * creates the sets
   * if “resultRetain” is set,
   * the previous sets are prefilled with the previous weights
   *
   */
  private _createSets(): void {
    const settings: I_Settings = JSON.parse(
      window.sessionStorage.getItem('settings')!
    );
    // by set result retain in the settings then set the previous training weigth results
    if (settings.resultRetain) {
      if (this.training) {
        for (let i = 0; i < this.training?.trainingResults?.[0]?.sets; i++) {
          if (this.training?.trainingResults?.[0]?.weights[i]) {
            this.itemControls.push(this._createFormControls());
            this.getWeightCtrl(i)?.setValue(
              this.training?.trainingResults?.[0]?.weights[i]
            );
          }
        }
      }
    } else {
      for (let i = 0; i < this.sets; i++) {
        this.itemControls.push(this._createFormControls());
      }
    }
  }
  /**
   *
   * @private
   *
   * @description
   * Subscribes to the Observable from the "_getActionCtrlAsObservable" method
   * and executes either the "_addTrainingGoal" or "_removeTrainingGoal" method.
   * Depending on the result of "actionCtrl"
   *
   */
  private _initComponent() {
    if (sessionStorage.getItem('uid')) {
      this._userKey = sessionStorage.getItem('uid')!;
      this._fetchTrainingInWorkout();
    } else {
      this._router.navigateByUrl(`/auth`, {
        replaceUrl: true,
      });
    }
  }
}
