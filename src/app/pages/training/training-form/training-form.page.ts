import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// data
import { CategoryArr } from 'src/app/shared/data/category';
import { DevicesArr } from 'src/app/shared/data/devices';
// services
import { TrainingService } from 'src/app/shared/services/trainingService/training.service';
// interface
import { I_Data } from 'src/app/shared/interfaces/I_Data';
import { I_Training } from 'src/app/shared/interfaces/I_Training';
import { AlertService } from 'src/app/shared/services/alert/alert.service';


@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.page.html',
  styleUrls: ['./training-form.page.scss'],
})
export class TrainingFormPage implements OnInit {

  protected trainForm: FormGroup = this._createTrainForm();
  // flag
  protected isSubmit: boolean = false;
  // data
  protected categories: I_Data[] = CategoryArr;
  protected devices: I_Data[] = DevicesArr;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _trainingService: TrainingService,
    private _alertService: AlertService,
  ) { }

  ngOnInit() {
  }

  protected get trainingCtrl(): AbstractControl<any, any> | null {
    return this.trainForm.get('trainingCtrl');
  }

  protected get deviceCtrl(): AbstractControl<any, any> | null {
    return this.trainForm.get('devices');
  }

  protected get categoryCtrl(): AbstractControl<any, any> | null {
    return this.trainForm.get('categoryId');
  }

  protected onSubmit(): void {
    this.isSubmit = true;
    if (this.trainForm.valid) {
      const trainOnj: I_Training = this._createTrainObj();
      const newTrainId =  this._trainingService.create(trainOnj);
      this.resetForm();
      if (newTrainId) {
        this.isSubmit = true;
        this._alertService.showAlert('Neues Training angelegt,', `Das Training "${this.trainingCtrl?.value}" wurde mit der ID ${newTrainId} angelegt`, 'success')
        this._router.navigateByUrl("/training-list", { replaceUrl: true });
      } else {
        this._alertService.showAlert('Fehler:,', `Das Training konnte nicht angelegt werden.`, 'danger')
      }

    } else {
      console.log('NOT VALID');
    }
  }

  protected resetForm(): void {
    this.isSubmit = false;
    this.trainForm.reset();
  }

  private _createTrainForm(): FormGroup {
    return this._fb.group({
      trainingCtrl: ['', [Validators.required]],
      categoryId: ['', Validators.required],
      devices: ['', Validators.required],
    });
  }

  private _createTrainObj(): I_Training {
    const trainObj: any = {};
    trainObj['categoryId'] = this.trainForm.get('categoryId')?.value;
    trainObj['devices'] = [];
    this.deviceCtrl?.value.forEach((item: number) => {
      trainObj['devices'].push(this.devices[item]);
    });
    trainObj['name'] = this.trainingCtrl?.value;

    if (this.trainForm.get('categoryId')) {
      const categoryIndex: number = this.trainForm.get('categoryId')?.value;
      trainObj['category'] = this.categories[categoryIndex];
    }
    trainObj['namespace'] = 'trains'

    trainObj['isGlobal'] = false;
    trainObj['userId'] = trainObj['isGlobal'] ? '' : window.sessionStorage.getItem('uid');
    trainObj['youtubeUrl'] = '',
    trainObj['pic'] = '';
    trainObj['created'] = Date.now();
    trainObj['updated'] = Date.now();
    return trainObj;
  }

}
