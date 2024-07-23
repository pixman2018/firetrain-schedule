import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// data
import { CategoryArr } from 'src/app/shared/data/category';
import { DevicesArr } from 'src/app/shared/data/devices';
// services
import { TrainingService } from 'src/app/shared/services/trainingService/training.service';
// interface
import { DataI } from 'src/app/shared/interfaces/DataI';
import { TrainingI } from 'src/app/shared/interfaces/TrainingI';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.page.html',
  styleUrls: ['./training-list.page.scss'],
})
export class TrainingListPage implements OnInit {

  protected trainForm: FormGroup = this._createTrainForm();
  // flag
  protected submited: boolean = false;
  // data
  protected categories: DataI[] = CategoryArr;
  protected devices: DataI[] = DevicesArr;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _trainingService: TrainingService,
  ) { }

  ngOnInit() {
  }

  protected get trainingCtrl(): AbstractControl<any, any> | null {
    return this.trainForm.get('train');
  }

  protected get deviceCtrl(): AbstractControl<any, any> | null {
    return this.trainForm.get('devices');
  }

  protected onSubmit(): void {
    this.submited = true;
    if (this.trainForm.valid) {

      let newTrainId: string = '';
      const trainOnj: TrainingI = this._createTrainObj();
      newTrainId =  this._trainingService.create(trainOnj);
      this.resetForm();
      if (newTrainId) {
        console.log('Created new train is successfully!');
        this.submited = true;
        this._router.navigateByUrl("/trains", { replaceUrl: true });
      }

    } else {
      console.log('NOT VALID');
    }
  }

  protected resetForm(): void {
    this.submited = false;
    this.trainForm.reset();
  }

  private _createTrainForm(): FormGroup {
    return this._fb.group({
      training: ['', [Validators.required]],
      categoryId: ['', Validators.required],
      devices: ['', Validators.required],
    });
  }

  private _createTrainObj(): TrainingI {
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
