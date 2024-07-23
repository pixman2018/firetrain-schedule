import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
// services
import { TrainingI } from '../../interfaces/TrainingI';


@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private _dbPath: string = '/trainings';
  private trainsCollection: AngularFirestoreCollection<TrainingI>;

  constructor(
    private _afs: AngularFirestore,
  ) {
    this.trainsCollection = _afs.collection(this._dbPath);
  }

  public create(train: TrainingI):  string  {
    const id = this._afs.createId();
    train['key'] = id;
    this.trainsCollection.doc(id).set(train);
    return id;
  }
}
