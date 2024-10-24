import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

// page
import { AboutPage } from '../pages/app/about/about.page';
// services
import { WorkoutService } from '../shared/services/workoutService/workout.service';
import { AuthService } from '../authification/services/auth.service';
// interface
import { I_Workout } from '../shared/interfaces/I_Workout';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  protected workouts: I_Workout[] = [];

  protected isAdmin: boolean = false;

  constructor(
    private readonly _authService: AuthService,
    private readonly _modalCtrl: ModalController,
    private readonly _workoutService: WorkoutService,
  ) {
    this._constructComponent();
  }

  ngOnInit(): void {
  }

  /**
   *
   * @protected
   * @memberof HomePage
   *
   * @description
   * open the AboutPage in a modal
   *
   */
  protected async onOpenAboutModal() {
    const modal = await this._modalCtrl.create({
      component: AboutPage,
    });

    modal.present();
  }

  /**
   *
   * @protected
   * @memberof HomePage
   *
   * @description
   * logout the user
   *
   */
  protected onLogout(): void {
    const res = this._authService.logout();
  }

  /**
   *
   * @private
   * @memberof HomePage
   *
   * @description
   * fetch all workouts from this user
   *
   */
  private _fetchAllWorkouts(): void {
    this._workoutService.fetchAll().subscribe((workout) => {
      if (workout) {
        this.workouts = workout;
      }
    });
  }

  /**
   *
   * @private
   * @memberof HomePage
   *
   * @description
   * if result retain is set, the checkbox “resultRetainCtrl” is set, otherwise it is false
   * Checks whether the logged in user is an admin
   *
   */
  private _constructComponent(): void {
    this._fetchAllWorkouts();

    if (window.sessionStorage.getItem('isAdmin')) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
}
