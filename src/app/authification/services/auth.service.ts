import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { first, map, Observable } from 'rxjs';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

// interfaces
import { UserI } from '../interfaces/UserI';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _dbPath: string = '/users';

  constructor(
    private _afs: AngularFirestore,
    private _auth: Auth,
    private _firestore: Firestore
  ) {}

  /**
   *
   * Register a new User with password and email
   *
   * @param { email, password}
   * @returns Promise<UserCredential | null>
   *
   */
  public async register({
    email,
    password,
  }: {
    [key: string]: string;
  }): Promise<UserCredential | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this._auth,
        email,
        password
      );
      /*
       *** set the user data Object
       */
      const userProfilDocumentRef = doc(
        this._firestore,
        `users/${userCredential.user.uid}`
      );
      const userObj = this._setUserData(userCredential, email);
      await setDoc(userProfilDocumentRef, userObj);
      await sendEmailVerification(userCredential.user);

      return userCredential;
    } catch (e) {
      return null;
    }
  }
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
      return authService.fetchUserByEmail(control.value).pipe(
        map((user) => {
          return user.length > 0 ? { userExists: true } : null;
        }),
        first()
      );
    };
  }

  /**
   * set the 'userObj' and return this
   *
   * @param userCredential
   * @param email
   * @returns UserI
   */
  private _setUserData(userCredential: UserCredential, email: string): UserI {
    const id: string = this._afs.createId();
    const userObj: UserI = {
      uid: userCredential.user.uid,
      key: id,
      email: email,
      isAdmin: false,
      isActive: true,
      namespace: 'users',
      verificationEmailTstamp: 0,
      isProVersion: false,
      isVerification: false,
      created: Date.now(),
      updated: Date.now(),
    };
    return userObj;
  }
}
