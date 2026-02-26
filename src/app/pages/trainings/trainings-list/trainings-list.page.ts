import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { TrainingFormPage } from '../training-form/training-form.page';
import { TrainingsStore } from 'src/app/services/trainings-store/trainings-store';
import { I_Training } from 'src/app/models/I_trainings.model';
import { exercisesFormPage } from '../../exercises/exercises-form/exercises-form.page';
import { exercisesListPage } from '../../exercises/exercises-list/exercises-list.page';

@Component({
  selector: 'app-trainings-list',
  templateUrl: './trainings-list.page.html',
  styleUrls: ['./trainings-list.page.scss'],
  standalone: true,
  imports: [
    JsonPipe,
    IonItem,
    IonButton,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonAccordion,
    IonAccordionGroup,
    IonLabel,
    CommonModule,
    TrainingFormPage,
    exercisesFormPage,
    exercisesListPage,
  ],
})
export class TrainingsListPage implements OnInit {
  private _trainingStore = inject(TrainingsStore);

  protected header: string = 'Trainings';
  protected trainings: Signal<Required<I_Training[]>> =
    this._trainingStore.exercises;
  protected showTrainingForm: boolean = false;
  constructor() {
    this._trainingStore.getAll();
    addIcons({ addOutline });
  }

  ngOnInit() {}

  protected addTraining() {
    this.showTrainingForm = true;
    this.header = 'Training hinzufügen';
  }

  protected onNewTraining(id: string) {
    if (id) {
      this.showTrainingForm = false;
      this.header = 'Trainings';
    }
  }
}
