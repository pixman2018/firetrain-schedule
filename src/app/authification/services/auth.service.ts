import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { BehaviorSubject, first, map, Observable } from 'rxjs';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

// interfaces
import { UserI } from '../interfaces/UserI';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _dbPath: string = '/users';
  private _currentUser$: BehaviorSubject<UserI> = new BehaviorSubject(
    this._setDefaultUserObj()
  );

  constructor(
    private _afs: AngularFirestore,
    private _router: Router,
    private _auth: Auth,
    private _firestore: Firestore,
    private _alertCtrl: AlertController,
    private _alertService: AlertService
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
   * Log in a user with his email and password.
   * The 'userId' and 'isLogged' are saved in the session.
   * The user's data is loaded from the database and stored in the BejourSubject '_currentUser$'
   *
   * @param { email, password}
   * @returns Promise<UserCredential | null>
   *
   */
  public async login({
    email,
    password,
  }: {
    [key: string]: string;
  }): Promise<UserCredential | null> {
    try {
      const user = signInWithEmailAndPassword(this._auth, email, password)
        .then((userCredential: UserCredential) => {
          if (userCredential.user.emailVerified) {
            // set the 'uid' and 'isLoged in the session storage'
            this._setCurrentUserSettings();
            // fetch the user data and set this in the Bejoursubject '_currentUser$'
            this.fetchUserByEmail(email).subscribe((user: UserI[]) => {
              if (user.length == 1) {
                this._currentUser$.next(user[0]);
                window.sessionStorage.setItem('isLogged', 'true');
                window.sessionStorage.setItem('uid', userCredential.user.uid);
              }
            });
          }
          return userCredential;
        })
        // catch a error from 'signInWithEmailAndPassword()'
        .catch((e: any) => {
          this._currentUser$.next(this._setDefaultUserObj());
          window.sessionStorage.removeItem('isLogged');
          window.sessionStorage.removeItem('uid');
          return null;
        });
      return user;
    } catch (e) {
      // catch a error from try
      this._currentUser$.next(this._setDefaultUserObj());
      window.sessionStorage.removeItem('isLogged');
      window.sessionStorage.removeItem('uid');
      return null;
    }
  }

  /**
   *
   * Logout the user
   *
   * @returns
   */
  public logout(): Promise<void> {
    this._currentUser$.next(this._setDefaultUserObj());
    window.sessionStorage.removeItem('isLogged');
    window.sessionStorage.removeItem('uid');
    this._router.navigateByUrl('/auth', { replaceUrl: true });
    return signOut(this._auth);
  }

  /**
   *
   * Send the user a email by forgotten password
   * and redirect to the login page
   *
   * @param email
   *
   */
  public forgottenPassword(email: string) {
    sendPasswordResetEmail(this._auth, email).then(async () => {
      this._alertService.showAlert(
        'Passwort vergessen',
        'Wir haben Dir soeben den Link zum Zurücksetzen des Passworts zugeschickt, bitte prüfe Deinw E-Mails.',
        'success'
      );
    });
  }

  /**
   *
   * fetch the current user from the BejourSubject '_currentUser$'
   * and return this as Observable
   *
   * @returns Observable<UserI>
   */
  public fetchCurrentUser(): Observable<UserI> {
    return this._currentUser$.asObservable();
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
   * set the 'uid' and the 'isLogged' in the session
   */
  private _setCurrentUserSettings(): void {
    onAuthStateChanged(this._auth, (user) => {
      if (user) {
        window.sessionStorage.setItem('uid', user.uid);
        window.sessionStorage.setItem('isLogged', 'true');
      } else {
        window.sessionStorage.removeItem('uid');
        window.sessionStorage.removeItem('isLogged');
      }
    });
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

  /**
   * fetch the standart UserI
   *
   * @returns UserI
   */
  private _setDefaultUserObj(): UserI {
    return {
      namespace: '',
      uid: '',
      key: '',
      email: '',
      isAdmin: false,
      isActive: false,
      isProVersion: false,
      isVerification: false,
      verificationEmailTstamp: 0,
      created: 0,
      updated: 0,
    };
  }
}
