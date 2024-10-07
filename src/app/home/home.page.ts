import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../shared/services/workoutService/workout.service';
import { I_Workout } from '../shared/interfaces/I_Workout';
import { ModalController } from '@ionic/angular';
import { AboutPage } from '../pages/app/about/about.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  protected workouts: I_Workout[] = [];

  constructor(
    private readonly _modalCtrl: ModalController,
    private readonly _workoutService: WorkoutService,
  ) {}

  ngOnInit(): void {
    this._initComponent();
  }

  protected async onOpenAboutModal() {
    const modal = await this._modalCtrl.create({
      component: AboutPage,
    });

    modal.present();
  }

  private _fetchAllWorkouts() {
    this._workoutService.fetchAll()
      .subscribe((workout) => {
        if (workout) {
          this.workouts = workout;
        }
      });
  }

  private _initComponent() {
    this._fetchAllWorkouts();
  }
}
