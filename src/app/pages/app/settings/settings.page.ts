import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { first } from 'rxjs';
import { I_Settings, I_User } from 'src/app/shared/interfaces/I_User';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  protected settings: I_Settings | null = null;
  private _user: I_User | null = null;

  // checkbox
  protected resultRetainCtrl: FormControl = new FormControl();

  constructor(private readonly _userService: UserService) {
    this._constructComponent();
  }

  ngOnInit() {}

  /**
   *
   * @protected
   * @param ctrlName
   * @memberof SettingsPage
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

    this._fetchUserByKeyAndUpdate();
  }

  /**
   *
   * @private
   * @memberof SettingsPage
   *
   * @description
   * fetch user by key and update the user
   *
   */
  private _fetchUserByKeyAndUpdate(): void {
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
              console.log('u', this.settings);
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
   * @memberof SettingsPage
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
          window.sessionStorage.setItem(
            'settings',
            JSON.stringify(this.settings)
          );
        })
        .catch((error) => {
          console.log('Error by User Update', error);
        });
    }
  }

  /**
   *
   * @private
   * @memberof SettingsPage
   *
   * @description
   * get the settings from the session storage
   *
   */
  private _constructComponent(): void {
    if (window.sessionStorage.getItem('settings')) {
      this.settings = JSON.parse(window.sessionStorage.getItem('settings')!);
      if (this.settings) {
        this.resultRetainCtrl.setValue(this.settings.resultRetain);
      }
    }
  }
}
