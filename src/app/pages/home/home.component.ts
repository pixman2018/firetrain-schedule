import { Component, inject, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { PracticeStore } from 'src/app/services/practice-store/practice-store';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton],
})
export class HomeComponent implements OnInit {
  private _praticeStore = inject(PracticeStore);
  constructor() {}

  ngOnInit() {}

  protected async add() {
    const obj = {
      pratice: 'Bizeps-Curls',
    };
    const res = await this._praticeStore.create(obj);
    if (res) {
      console.log(`New pratice ${res}`);
    }
  }
}
