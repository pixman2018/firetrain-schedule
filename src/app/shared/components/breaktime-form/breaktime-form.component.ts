import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

// services
import { DateService } from '../../services/date/date.service';
import { UserService } from '../../services/user/user.service';
// interfaces
import { I_Settings, I_User } from '../../interfaces/I_User';
import { I_TimeObj } from '../../interfaces/I_DateTime';
import { first } from 'rxjs';

@Component({
  selector: 'app-breaktime-form',
  templateUrl: './breaktime-form.component.html',
  styleUrls: ['./breaktime-form.component.scss'],
})
export class BreaktimeFormComponent implements OnInit {
  protected settings: I_Settings | null = null;
  private _user: I_User | null = null;

  // form
  protected breaktimeFrom: FormGroup = this._createBreaktimeForm();

  constructor(
    private readonly _dateService: DateService,
    private readonly _userService: UserService,
    private readonly _fb: FormBuilder
  ) {
    this._constructComponent();
  }

  ngOnInit() {}

  /**
   *
   * @private
   * @memberof BreaktimeFormComponent
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
   * @memberof BreaktimeFormComponent
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

  /*
   ********************************************************************************
   *****
   ***
   * Form
   ***
   *****
   ********************************************************************************
   */

  /**
   *
   * @protected
   * @memberof BreaktimeFormComponent
   *
   * @description
   * create and fill a timeObj and
   * edit the new breaktime in the db
   *
   */
  protected onSubmitBreaktime() {
    if (this.breaktimeFrom.valid) {
      const timeObj: I_TimeObj = {
        hours: '0',
        minutes: this._dateService.zeroPad(this.minCtrl?.value),
        seconds: this._dateService.zeroPad(this.secCtrl?.value),
        miliseconds: '0',
      };
      const tmp: number = this._dateService.getTmpFromTimeObj(timeObj);

      if (this.settings) {
        this.settings.breaktime = tmp;
      }

      this._fetchUserByKeyAndUpdate();
    }
  }

  /**
   *
   * @private
   * @returns FormGroup
   * @memberof BreaktimeFormComponent
   *
   * @description
   * create the breaktime form group
   *
   */
  private _createBreaktimeForm(): FormGroup {
    const breaktime: I_TimeObj = this._convertTmpInTimeObj();
    return this._fb.group({
      min: [breaktime.minutes, Validators.required],
      sec: [breaktime.seconds, Validators.required],
    });
  }

  /*
   ********************************************************************************
   * Form helper
   ********************************************************************************
   */

  /**
   *
   * @protected
   * @memberof BreaktimeFormComponent
   * @returns AbstractControl<any, any> | null
   *
   * @description
   * get the AbstractControl  "min"
   *
   */
  protected get minCtrl(): AbstractControl<any, any> | null {
    return this.breaktimeFrom.get('min');
  }

  /**
   *
   * @protected
   * @memberof BreaktimeFormComponent
   * @returns AbstractControl<any, any> | null
   *
   * @description
   * get the AbstractControl  "min"
   *
   */
  protected get secCtrl(): AbstractControl<any, any> | null {
    return this.breaktimeFrom.get('sec');
  }

  /**
   *
   * @private
   * @memberof BreaktimeFormComponent
   * @return I_TimeObj
   *
   * @description
   * convert a timestamp in a timeObject
   *
   */
  private _convertTmpInTimeObj(): I_TimeObj {
    const settings = JSON.parse(window.sessionStorage.getItem('settings')!);
    return this._dateService.getTimeFromTstamp(settings.breaktime);
  }

  /**
   *
   * @private
   * @memberof BreaktimeFormComponent
   *
   * @description
   * get the settings from the session storage
   *
   */
  private _constructComponent(): void {
    if (window.sessionStorage.getItem('settings')) {
      this.settings = JSON.parse(window.sessionStorage.getItem('settings')!);
    }
  }
}
