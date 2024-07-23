import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
// interfcae
import { WorkoutI } from '../../interfaces/Workout';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  private _dbPath: string = '/workouts';
  private _workoutCollection: AngularFirestoreCollection<WorkoutI>;
  private _userId: string = '-1';

  constructor(
    private readonly _router: Router,
    private _afs: AngularFirestore,
  ) {
    this._workoutCollection = _afs.collection(this._dbPath);
    this._constructComponent();
  }

  public create(workout: WorkoutI): string | undefined {
    const id = this._afs.createId();
    workout['key'] = id;
    this._workoutCollection.doc(id).set(workout);
    return id;
  }

  private async _constructComponent() {
    const userId =  sessionStorage.getItem('uid') ;
    if (userId) {
      this._userId = userId;
    } else {
      this._router.navigateByUrl('/auth', { replaceUrl: true });
    }
  }
}
