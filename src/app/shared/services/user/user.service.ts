import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
// interfaces
import { I_User } from '../../interfaces/I_User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _dbPath: string = '/users';
  private _usersCollection: AngularFirestoreCollection<any>;

  constructor(private _afs: AngularFirestore,) {
    this._usersCollection = _afs.collection(this._dbPath);
  }

  public getUserByKey(key: string):Observable<I_User | undefined> {
    const trainDoc = this._afs.doc<I_User>(`${this._dbPath}/${key}`);
    return trainDoc.valueChanges();
  }
}
