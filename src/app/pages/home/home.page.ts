import { Component, inject, OnInit } from '@angular/core';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Initexercises } from 'src/db/initExercises';
import { TrainingsListPage } from '../trainings/trainings-list/trainings-list.page';
import { exercisesCategoryOptiomsProvider } from 'src/app/models/I_exercisesCategory.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    TrainingsListPage,
  ],
  providers: [Initexercises, exercisesCategoryOptiomsProvider],
})
export class HomePage implements OnInit {
  private _initexercises = inject(Initexercises);

  constructor() {}

  ngOnInit() {}

  protected async add() {
    this._initexercises._addAllexercisess();
  }
}
