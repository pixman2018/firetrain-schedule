import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

// interfaces
import { I_User } from '../../interfaces/I_User';
import { UserI } from 'src/app/authification/interfaces/UserI';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private _dbPath: string = '/users';
  private _usersCollection: AngularFirestoreCollection<any>;

  constructor(private _afs: AngularFirestore) {
    this._usersCollection = _afs.collection(this._dbPath);
  }

  /**
   *
   * @protected
   * @param key
   * @returns Observable<I_User | undefined>
   * @memberof UserService
   *
   * @description
   * fetch user by id
   *
   */
  public getUserByKey(key: string): Observable<I_User | undefined> {
    const trainDoc = this._afs.doc<I_User>(`${this._dbPath}/${key}`);
    return trainDoc.valueChanges();
  }

  /**
   *
   * @protected
   * @param user
   * @returns string
   * @memberof UserService
   *
   * @description
   * create a new user
   *
   */
  public create(user: UserI): string {
    const id = this._afs.createId();
    user['key'] = id;
    this._usersCollection.doc(id).set(user);
    return id;
  }

  /**
   *
   * @protected
   * @param user
   * @memberof UserService
   *
   * @description
   * edit a  user
   *
   */
  public edit(user: I_User): Promise<void> {
    return this._usersCollection.doc(user.uid).update(user);
  }

  /**
   *
   * @public
   * @param key from user
   * @memberof UserService
   *
   * @description
   * delete a user
   *
   */
  public del(key: string): Promise<void> {
    return this._usersCollection.doc(key).delete();
  }
}
