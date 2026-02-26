import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);

  public currentUser = toSignal<User | null>(user(this._auth));

  public async login(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(
      this._auth,
      email,
      password,
    );
    return userCredential;
  }

  public async logout() {
    return signOut(this._auth);
  }
}
