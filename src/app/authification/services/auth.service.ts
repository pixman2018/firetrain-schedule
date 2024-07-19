import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { first, map, Observable } from 'rxjs';
// interfaces
import { UserI } from '../interfaces/UserI';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _dbPath: string = '/users';

  constructor(  
    private _afs: AngularFirestore,
  ) { }

    /**
   *
   * fetch a user by email
   *
   * @param email
   * @returns Observable<UserI[]>
   *
   */
    public fetchUserByEmail(email: string): Observable<UserI[]> {
      return this._afs
        .collection<UserI>(this._dbPath, (ref) => ref.where('email', '==', email))
        .valueChanges({ idField: 'key' });
    }

  static emailExists(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return authService.fetchUserByEmail(control.value)
        .pipe(
          map(user => {
            console.log('auth', user.length > 0 ? { userExists: true } : null)
            return user.length > 0 ? { userExists: true } : null;
          }),
          first(),
        )
    };
  }
}
