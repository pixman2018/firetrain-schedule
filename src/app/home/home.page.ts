import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../shared/services/workoutService/workout.service';
import { I_Workout } from '../shared/interfaces/I_Workout';
import { ModalController } from '@ionic/angular';
import { AboutPage } from '../pages/app/about/about.page';
import { AuthService } from '../authification/services/auth.service';
import { FormControl } from '@angular/forms';
import { UserService } from '../shared/services/user/user.service';
import { first } from 'rxjs';
import { I_Settings, I_User } from '../shared/interfaces/I_User';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  protected workouts: I_Workout[] = [];
  // checkbox
  protected resultRetainCtrl: FormControl = new FormControl();

  protected settings: I_Settings | null = null;
  private _user: I_User | null = null;;

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
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

  protected onChangeCheckbox( ctrlName: string) {
    switch(ctrlName) {
      case 'resultRetainCtrl':
        if (this.settings != null) {
          this.settings['resultRetain'] = this.resultRetainCtrl.value;
          window.sessionStorage.setItem('settings', JSON.stringify(this.settings));
        }
        break;
    }

    this._fetchUserByKey(window.sessionStorage.getItem('uid')!);
  }

  protected onLogout() {
    const res = this._authService.logout();
    console.log('logout', res);
  }

  private _fetchAllWorkouts() {
    this._workoutService.fetchAll()
      .subscribe((workout) => {
        if (workout) {
          this.workouts = workout;
        }
      });
  }

  private _fetchUserByKey(key: string) {
    if (window.sessionStorage.getItem('uid')) {
      this._userService.getUserByKey(window.sessionStorage.getItem('uid')!)
        .pipe(
          first()
        )
        .subscribe({
          next:(user) => {
            if (user) {
              this._user = user;
            }
          },
          complete: () => {
            if (this.settings) {
              this._updateUser(this.settings);
            }
          },
          error: (error => {
            console.error('Error by loaded User', error );
          })
        });
    }
  }

  private _updateUser(settings: I_Settings ) {
    if (this._user) {
      this._user.settings = settings;
      this._userService.edit(this._user)
        .then(() => {
          console.log('User updated!');
        })
        .catch(error => {
          console.log('Error by User Update', error);
        })
    }

  }

  private _initComponent() {
    this._fetchAllWorkouts();
    if (window.sessionStorage.getItem('settings')) {
      this.settings = JSON.parse(window.sessionStorage.getItem('settings')!);
      if (this.settings) {
        this.resultRetainCtrl.setValue(this.settings.resultRetain);
      }
    }
  }
}
