import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { PracticeStore } from '../services/practice-store/practice-store';
import { HomePage } from '../pages/home/home.page';
import { TrainingFormPage } from '../pages/trainings/training-form/training-form.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    HomePage,
    TrainingFormPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
  ],
})
export class Tab1Page {
  private _practiceStore = inject(PracticeStore);
  constructor() {
    this.getAll();
  }

  protected async getAll() {
    const res = await this._practiceStore.getAll();
    console.log(res);
  }
}
