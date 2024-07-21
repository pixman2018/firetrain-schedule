import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertService } from 'src/app/shared/services/alert/alert.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  protected forgottenPwForm: FormGroup = this._createForgottenPwForm();
  protected isSubmit: boolean = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    private readonly _alertService: AlertService,
  ) { }

  ngOnInit() {}

  /**
   *
   * send a email to chance the password
   *
   */
  protected onSubmitForgottenPW(): void {
    this.isSubmit = true;
    if (this.forgottenPwForm.valid) {
      this._authService.forgottenPassword(
        this.forgottenPwForm.get('email')?.value
      );
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
    return this.forgottenPwForm.get('email');
  }

  /**
   *
   * Create the ForgottenPwForm
   *
   * @returns
   */
  private _createForgottenPwForm(): FormGroup {
    return this._fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
