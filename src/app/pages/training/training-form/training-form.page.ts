import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// data
import { CategoryArr } from 'src/app/shared/data/category';

// services
import { TrainingService } from 'src/app/shared/services/trainingService/training.service';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
// interface
import { I_Data } from 'src/app/shared/interfaces/I_Data';
import { I_Training } from 'src/app/shared/interfaces/I_Training';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.page.html',
  styleUrls: ['./training-form.page.scss'],
})
export class TrainingFormPage implements OnInit {
  protected trainForm: FormGroup = this._createTrainForm();
  // flag
  protected isSubmit: boolean = false;
  protected isEdit: boolean = false;
  // data
  protected categories: I_Data[] = CategoryArr;
  protected isAdmin: boolean = false;

  protected training: I_Training | undefined;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _trainingService: TrainingService,
    private readonly _alertService: AlertService
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  /**
   *
   * @protected
   * @memberof AuthPage
   * @returns AbstractControl<any, any> | null
   *
   * @description
   * get the AbstractControl  "trainingCtrl"
   *
   */
  protected get trainingCtrl(): AbstractControl<any, any> | null {
    return this.trainForm.get('trainingCtrl');
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
  protected get bodyWeightCtrl(): AbstractControl<any, any> | null {
    return this.trainForm.get('bodyweight');
  }

  /**
   *
   * @protected
   * @memberof AuthPage
   * @returns AbstractControl<any, any> | null
   *
   * @description
   * get the AbstractControl  "categoryId"
   *
   */
  protected get categoryCtrl(): AbstractControl<any, any> | null {
    return this.trainForm.get('categoryId');
  }

  /**
   *
   * @protected
   * @memberof AuthPage
   * @returns AbstractControl<any, any> | null
   *
   * @description
   * get the AbstractControl  "globalCtrl"
   *
   */
  protected get globalCtrl(): AbstractControl<any, any> | null {
    return this.trainForm.get('global');
  }

  /**
   *
   * @protected
   * @memberof TrainingFormPage
   *
   * @description
   * refers to “_submitEdit” or “_submitAdd” after the submit of the form
   *
   */
  protected onSubmit(): void {
    this.isSubmit = true;
    if (this.trainForm.valid) {
      if (this.isEdit) {
        this._submitEdit();
      } else {
        this._submitAdd();
      }
    } else {
      console.log('NOT VALID');
    }
  }

  /**
   *
   * @private
   * @memberof TrainingFormPage
   *
   * @description
   * save the new training in the db
   *
   */
  private _submitAdd() {
    const trainObj: I_Training = this._createTrainObj();
    const newTrainId = this._trainingService.create(trainObj);
    this.resetForm();
    if (newTrainId) {
      this.isSubmit = true;
      this._alertService.showAlert(
        'Neues Training angelegt,',
        `Das Training "${this.trainingCtrl?.value}" wurde mit der ID ${newTrainId} angelegt`,
        'success'
      );
      this._router.navigateByUrl('/training-list', { replaceUrl: true });
    } else {
      this._alertService.showAlert(
        'Fehler:,',
        `Das Training konnte nicht angelegt werden.`,
        'danger'
      );
    }
  }

  /**
   *
   * @private
   * @memberof TrainingFormPage
   *
   * @description
   * save the edit training in the db
   *
   */
  private _submitEdit(): void {
    if (this.training) {
      const trainObj: I_Training = this._createTrainObj();
      trainObj['key'] = this.training.key;
      this._trainingService
        .edit(trainObj)
        .then(() => {
          this._alertService.showToast(
            `Workout "${this.training?.name}" geändert`,
            'middle',
            'success'
          );
          this._router.navigateByUrl(`training-list`, {
            replaceUrl: true,
          });
        })
        .catch((error) => {
          console.error('Error', 'by edit workout');
        });
    }
  }

  /**
   *
   * @protected
   * @memberof TrainingFormPage
   *
   * @description
   * reset the form
   *
   */
  protected resetForm(): void {
    this.isSubmit = false;
    this.trainForm.reset();
  }

  /**
   *
   * @private
   * @returns FormGroup
   * @memberof TrainingFormPage
   *
   * @description
   * create the forms and set the validators
   *
   */
  private _createTrainForm(): FormGroup {
    return this._fb.group({
      trainingCtrl: ['', [Validators.required]],
      categoryId: ['', Validators.required],
      bodyweight: [false],
      global: [false],
    });
  }

  /**
   *
   * @private
   * @returns I_Training
   * @memberof TrainingFormPage
   *
   * @description
   * creates a training object with the values entered in the form and returns it
   *
   */
  private _createTrainObj(): I_Training {
    const trainObj: any = {};
    trainObj['categoryId'] = this.trainForm.get('categoryId')?.value;
    trainObj['name'] = this.trainingCtrl?.value;

    if (this.trainForm.get('categoryId')) {
      const categoryIndex: number = this.trainForm.get('categoryId')?.value;
      trainObj['category'] = this.categories[categoryIndex];
    }
    trainObj['namespace'] = 'trainings';
    trainObj['isBodyWeight'] = this.bodyWeightCtrl?.value;
    trainObj['isGlobal'] = this.globalCtrl?.value;
    trainObj['userId'] = trainObj['isGlobal']
      ? ''
      : window.sessionStorage.getItem('uid');
    (trainObj['youtubeUrl'] = ''), (trainObj['pic'] = '');
    if (!this.isEdit) {
      trainObj['created'] = Date.now();
    } else {
      trainObj['created'] = this.training?.created;
    }
    trainObj['updated'] = Date.now();
    return trainObj;
  }

  /**
   *
   * @private
   * @memberof TrainingFormPage
   *
   * @description
   * check is the current user not a admin
   *
   * If the parameter 'isEdit' is in the URL then load the training and set the values in the form
   *
   */
  private _initComponent(): void {
    // is the current user not a admin then redirect to "workout-list"
    this.isAdmin = Boolean(window.sessionStorage.getItem('isAdmin')!) ?? false;
    if (!this.isAdmin) {
      this._router.navigateByUrl('/workout-list', { replaceUrl: true });
    }

    const isEdit: boolean | null = Boolean(
      this._route.snapshot.queryParamMap.get('isEdit')
    );
    if (this._route.snapshot.queryParamMap.has('isEdit')) {
      if (isEdit) {
        this.isEdit = isEdit;
        const key: string | null = this._route.snapshot.paramMap.get('key');
        if (key) {
          this._trainingService.fetchByKey(key).subscribe({
            next: (training) => {
              if (training) {
                // set the current value in the form controller
                this.training = training;
                this.trainingCtrl?.setValue(training?.name);
                this.categoryCtrl?.setValue(training?.categoryId);
                this.globalCtrl?.setValue(training?.isGlobal);
                this.bodyWeightCtrl?.setValue(training?.isBodyWeight ?? false);
              }
            },
            complete: () => {},
            error: (error) => {
              console.error('Error by loaded User', error);
            },
          });
        }
      }
    }
  }
}
