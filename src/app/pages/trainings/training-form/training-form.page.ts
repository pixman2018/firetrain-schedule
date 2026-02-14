import { Component, inject, OnInit, signal } from '@angular/core';

import {
  form,
  minLength,
  required,
  min,
  applyEach,
  FieldTree,
  FormField,
  maxLength,
} from '@angular/forms/signals';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { I_Training } from 'src/app/models/trainings.model';
import { TrainingsStore } from 'src/app/services/trainings-store/trainings-store';

const ionicModule = [
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonList,
  IonButton,
];
@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.page.html',
  styleUrls: ['./training-form.page.scss'],
  standalone: true,
  imports: [FormField, ...ionicModule],
})
export class TrainingFormPage implements OnInit {
  private _trainingStore = inject(TrainingsStore);
  private _trainingModel = signal<I_Training>(this._defaultFormObj());

  private _defaultFormObj(): I_Training {
    return {
      name: '',
    };
  }

  protected trainingForm = form(this._trainingModel, (schemaPath) => {
    required(schemaPath.name);
    minLength(schemaPath.name, 3);
    maxLength(schemaPath.name, 100);
  });
  constructor() {}

  ngOnInit() {}

  protected onSubmit() {
    if (this.trainingForm().valid()) {
      const res = this._trainingStore.create(this.trainingForm().value());
    }
  }
}
