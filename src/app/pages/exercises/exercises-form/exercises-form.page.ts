import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  EXERCISES_CATEGORY_OPTIONS,
  exercisesCategoryOptiomsProvider,
} from 'src/app/models/I_exercisesCategory.model';
import { I_Practic } from 'src/app/models/I_exercises.model';
import { exercisesStore } from 'src/app/services/exercises-store/exercises-store';

const ionicComponents = [
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
];
@Component({
  selector: 'app-exercises-form',
  templateUrl: './exercises-form.page.html',
  styleUrls: ['./exercises-form.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ...ionicComponents],
  providers: [exercisesCategoryOptiomsProvider],
})
export class exercisesFormPage implements OnInit {
  private _exercisesStore = inject(exercisesStore);
  protected exercisesCategoryOptioms = inject(EXERCISES_CATEGORY_OPTIONS);

  protected exercisess: I_Practic[] = [];

  constructor() {}

  ngOnInit() {}

  protected async omSelectCategory(event: CustomEvent): Promise<void> {
    if (event) {
      const exercisess = await this._exercisesStore.getByCategory(
        event.detail.value,
      );

      this.exercisess = exercisess;
    }
  }

  protected async omSelectexercises(event: CustomEvent) {
    console.log(event.detail.value);
    // const newexercisest: I_Practic = {};
  }
}
