import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, take } from 'rxjs';

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
    private readonly _afs: AngularFirestore,
  ) {
    this._workoutCollection = _afs.collection(this._dbPath);
    this._constructComponent();
  }

  /**
   *
   *
   *
   * @param key from Workout
   * @returns workout Object
   */
  public fetchByKey(key: string):Observable<WorkoutI | undefined> {
    return this._afs.doc<WorkoutI>(`${this._dbPath}/${key}`)
    .valueChanges({idField: 'key'})
    .pipe(
      take(1),
    );
  }

  public create(workout: WorkoutI): string | undefined {
    const key = this._afs.createId();
    workout['key'] = key;
    this._workoutCollection.doc(key).set(workout);
    return key;
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
