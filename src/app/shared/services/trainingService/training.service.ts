import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
// services
import { I_Training } from '../../interfaces/I_Training';


@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private _dbPath: string = '/trainings';
  private trainsCollection: AngularFirestoreCollection<I_Training>;

  constructor(
    private _afs: AngularFirestore,
  ) {
    this.trainsCollection = _afs.collection(this._dbPath);
  }

  public create(train: I_Training):  string  {
    const id = this._afs.createId();
    train['key'] = id;
    this.trainsCollection.doc(id).set(train);
    return id;
  }
}
