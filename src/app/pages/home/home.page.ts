import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { PracticeStore } from 'src/app/services/practice-store/practice-store';
import { InitPractice } from 'src/db/initPractice';

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
    CommonModule,
    FormsModule,
  ],
  providers: [InitPractice],
})
export class HomePage implements OnInit {
  private _praticeStore = inject(PracticeStore);
  private _initPractice = inject(InitPractice);
  constructor() {}

  ngOnInit() {}

  protected async add() {
    this._initPractice._addAllPractices();
  }
}
