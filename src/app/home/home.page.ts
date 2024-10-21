import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { first } from 'rxjs';
import { ModalController } from '@ionic/angular';

// page
import { AboutPage } from '../pages/app/about/about.page';
// services
import { UserService } from '../shared/services/user/user.service';
import { WorkoutService } from '../shared/services/workoutService/workout.service';
import { AuthService } from '../authification/services/auth.service';
// interface
import { I_Settings, I_User } from '../shared/interfaces/I_User';
import { I_Workout } from '../shared/interfaces/I_Workout';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  protected workouts: I_Workout[] = [];
  // checkbox
  protected resultRetainCtrl: FormControl = new FormControl();

  protected isAdmin: boolean = false;
  protected settings: I_Settings | null = null;
  private _user: I_User | null = null;

  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _modalCtrl: ModalController,
    private readonly _workoutService: WorkoutService
  ) {}

  ngOnInit(): void {
    this._initComponent();
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
   * @param ctrlName
   * @memberof HomePage
   *
   * @description
   * set the values that were changed in the settings
   *
   */
  protected onChangeCheckbox(ctrlName: string): void {
    switch (ctrlName) {
      case 'resultRetainCtrl':
        if (this.settings != null) {
          this.settings['resultRetain'] = this.resultRetainCtrl.value;
          window.sessionStorage.setItem(
            'settings',
            JSON.stringify(this.settings)
          );
        }
        break;
    }

    this._fetchUserByKey();
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
   * fetch user by key
   *
   */
  private _fetchUserByKey(): void {
    if (window.sessionStorage.getItem('uid')) {
      this._userService
        .getUserByKey(window.sessionStorage.getItem('uid')!)
        .pipe(first())
        .subscribe({
          next: (user) => {
            if (user) {
              this._user = user;
            }
          },
          complete: () => {
            if (this.settings) {
              this._updateUser(this.settings);
            }
          },
          error: (error) => {
            console.error('Error by loaded User', error);
          },
        });
    }
  }

  /**
   *
   * @private
   * @param settings
   * @memberof HomePage
   *
   * @description
   * update the user data
   *
   */
  private _updateUser(settings: I_Settings): void {
    if (this._user) {
      this._user.settings = settings;
      this._userService
        .edit(this._user)
        .then(() => {
          console.log('User updated!');
        })
        .catch((error) => {
          console.log('Error by User Update', error);
        });
    }
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
  private _initComponent(): void {
    this._fetchAllWorkouts();
    if (window.sessionStorage.getItem('settings')) {
      this.settings = JSON.parse(window.sessionStorage.getItem('settings')!);
      if (this.settings) {
        this.resultRetainCtrl.setValue(this.settings.resultRetain);
      }
    }
    if (window.sessionStorage.getItem('isAdmin')) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
}
