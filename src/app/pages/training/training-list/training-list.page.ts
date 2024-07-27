import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// data
import { CategoryArr } from 'src/app/shared/data/category';
// services
import { TrainingService } from 'src/app/shared/services/trainingService/training.service';
// Interfcaes
import { DataI } from 'src/app/shared/interfaces/DataI';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.page.html',
  styleUrls: ['./training-list.page.scss'],
})
export class TrainingListPage implements OnInit {

  protected selected = new FormControl('');

   // data
   protected categories: DataI[] = CategoryArr;

  constructor(
    private _trainingService: TrainingService,
  ) { }

  ngOnInit() {

  }

  protected get selectedCtrl(): string | null {
    return this.selected.value;
  }

  protected onSelected() {
    console.log('selected', this.selected.value);

  }

  protected onCancel() {
    this.selected.setValue('');
  }

  protected onHandleInput(event: any) {
    const filter = event.target.value.toLowerCase();
    console.log(filter);
  }



}
