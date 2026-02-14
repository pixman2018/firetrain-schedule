import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  form,
  minLength,
  required,
  min,
  applyEach,
  FieldTree,
  FormField,
} from '@angular/forms/signals';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { I_Training } from 'src/app/models/trainings.model';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.page.html',
  styleUrls: ['./training-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule],
})
export class TrainingFormPage implements OnInit {
  private _trainingModel = signal<I_Training>(this._defaultFormObj());

  private _defaultFormObj(): I_Training {
    return {
      name: '',
      practives: [],
    };
  }

  protected trainingForm = form();
  constructor() {}

  ngOnInit() {}
}
