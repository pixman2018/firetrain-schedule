import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MustMatch } from 'src/app/shared/validators/MustMatchValidator';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  protected credentialsForm: FormGroup = this._createCredentialsForm();
  // flag
  protected isLogin: boolean = true; // show the form login or register

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
  ) { }

  ngOnInit() {
  }

  protected onLogin() {}

  protected onRegister() {}

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
