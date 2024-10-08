import { Component, isDevMode, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// ionic
import { LoadingController } from '@ionic/angular';
// services
import { AuthService } from '../services/auth.service';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
// validators
import { MustMatch } from 'src/app/shared/validators/MustMatchValidator';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  // form
  protected credentialsForm: FormGroup = this._createCredentialsForm();
  protected inputValueFormCtrls: {
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  } = {
    email: false,
    password: false,
    confirmPassword: false,
  };

  // flag
  protected isLogin: boolean = true; // show the form login or register
  protected showPassword: boolean = false;
  protected showConfirmPassword: boolean = false;
  protected isSubmit: boolean = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _loadingCtrl: LoadingController,
    private readonly _authService: AuthService,
    private readonly _alertService: AlertService,
    private readonly _userService: UserService,
  ) { }

  ngOnInit() {
  }

  /**
   *
   * Login  User
   *
   */
  protected async onLogin() {
    const loading = await this._loadingCtrl.create();
    await loading.present();

    const user = await this._authService.login(this.credentialsForm.value);

    if (user && user.user.emailVerified) {
      this._alertService.showToast(
        'Du hast Dich angemeldet.',
        'middle',
        'success'
      );
      this._router.navigateByUrl('/workout-list', { replaceUrl: true });
    } else if (!user){
      this._alertService.showAlert(
        'Login fehlgeschlagen.',
        'Bitte versuche es nocheinmal',
        'danger'
      );
    } else if (user && !user.user.emailVerified) {
      console.error('email not Verified');
    } else {
      this._alertService.showAlert(
        'Login fehlgeschlagen.',
        'Bitte versuche es nocheinmal',
        'danger'
      );
  }
  this.credentialsForm.reset();
  if (isDevMode() && user && user.user.uid) {
    this._userService.getUserByKey(user.user.uid)
      .subscribe((res) => {
        if (res?.isAdmin) {
          window.sessionStorage.setItem('isAdmin', 'true');
        }
      });
  }
  await loading.dismiss();
}

  /**
   *
   * Register a User
   *
   */
  protected async onRegister(): Promise<void> {
    this.isSubmit = true;
    if (this.credentialsForm.valid) {
      const loading = await this._loadingCtrl.create();
      await loading.present();

      if (this.credentialsForm.valid) {
        const user = await this._authService.register(
          this.credentialsForm.value
        );

        if (user) {
          this.isLogin = true;
          this._alertService.showAlert(
            'Vielen Dank,',
            'Du hast dich bei uns erfolgreich registriert. Wir haben dir eine Email mit der Anmelde-Bestätigung zugesendet. Bitte bestätige in der Email Dein Anmeldung.',
            'danger'
          );
        } else {
          this._alertService.showAlert(
            'Registration fehlgeschlagen',
            'Bitte versuche es nocheinmal',
            'danger'
          );
        }
        await loading.dismiss();
      }
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

  public onLeaveFromCtrl(inputCtrl: string) {
    switch (inputCtrl) {
      case 'email':
        this.inputValueFormCtrls.email = true;
        break;
      case 'password':
        this.inputValueFormCtrls.password = true;
        break;
      case 'confirmPassword':
        this.inputValueFormCtrls.confirmPassword = true;
        break;
    }
  }


  /**
 *
 * chance the 'showConfirmPassword' flag
 * This means that the password is visible or invisible
 *
 * @param isConfirmPw
 */
  protected togglePasswordVisibility(isConfirmPw: boolean = false): void {
    if (isConfirmPw) {
      this.showConfirmPassword = !this.showConfirmPassword;
    } else {
      this.showPassword = !this.showPassword;
    }
  }

  /**
   *
   * get the AbstractControl  "email"
   *
   * @return  AbstractControl<any, any> | null
   *
   */
  protected get email(): AbstractControl<any, any> | null {
    return this.credentialsForm.get('email');
  }

  /**
   *
   * get the AbstractControl  "password"
   *
   * @return  AbstractControl<any, any> | null
   *
   */
  protected get password(): AbstractControl<any, any> | null | undefined {
    return this.credentialsForm.get('password');
  }

  /**
   *
   * get the AbstractControl  "confirmPassword"
   *
   * @return  AbstractControl<any, any> | null
   *
   */
  protected get confirmPassword(): AbstractControl<any, any> | null {
    return this.credentialsForm.get('confirmPassword');
  }

  /**
 *
 * create the forms
 *
 * @returns FormGroup
 *
 */
  private _createCredentialsForm(): FormGroup {
    return this._fb.group(
      {
        email: [
          '',
          [Validators.required, Validators.email],
          [AuthService.emailExists(this._authService)],
        ],
        password: ['', [Validators.required, Validators.minLength(10)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: MustMatch('password', 'confirmPassword'),
      }
    );
  }

}
