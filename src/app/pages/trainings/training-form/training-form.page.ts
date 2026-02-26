import { Component, inject, OnInit, output, signal } from '@angular/core';

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
import { I_Training } from 'src/app/models/I_trainings.model';
import { TrainingsStore } from 'src/app/services/trainings-store/trainings-store';
import { AuthService } from '../../auth/services/auth-service';

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
  private _authService = inject(AuthService);

  public newTraining = output<string>();
  private _trainingModel = signal<
    Omit<I_Training, 'createdAt' | 'updatedAt' | 'uid'>
  >(this._defaultFormObj());

  private _defaultFormObj(): Omit<
    I_Training,
    'createdAt' | 'updatedAt' | 'uid'
  > {
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

  protected async onSubmit() {
    const user = this._authService.currentUser();

    if (user && user.uid && this.trainingForm().valid()) {
      const newTraining: I_Training = {
        ...this.trainingForm().value(),
        uid: user.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const res = await this._trainingStore.create(newTraining);
      this.newTraining.emit(res);
    }
  }
}
