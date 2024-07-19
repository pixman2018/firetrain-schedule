import { AbstractControl } from '@angular/forms';

/*
********************************************************************************
*****
*** validator to check that two fields match
*
* Exaple:
* return this._fb.group(
      {
        email: [
          '',
          [Validators.required, Validators.email],
          [this._uniqueUsernameValidator]
        ],
        password: ['', [Validators.required, Validators.minLength(10)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(10)]],
      },
      {
        validators: MustMatch('password', 'confirmPassword'),
      }
    );
*****
********************************************************************************
*/
export function MustMatch(controlName: string, matchingControlName: string) {
    return (group: AbstractControl) => {
        const control = group.get(controlName);
        const matchingControl = group.get(matchingControlName);

        if (!control || !matchingControl) {
            return null;
        }

        // return if another validator has already found an error on the matchingControl
        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            return null;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
        return null;
    }
}
