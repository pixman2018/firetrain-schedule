import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, take } from 'rxjs';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
// interfcae
import { I_Workout } from '../../interfaces/I_Workout';



@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  private _dbPath: string = '/workouts';
  private _workoutCollection: AngularFirestoreCollection<I_Workout>;
  private _userId: string = '-1';

  constructor(
    private readonly _router: Router,
    private readonly _afs: AngularFirestore,
  ) {
    this._workoutCollection = _afs.collection(this._dbPath);
    this._constructComponent();
  }

  public fetchAll():Observable<I_Workout[] | undefined>  {
    const userKey = window.sessionStorage.getItem('uid');
    return this._afs.collection<I_Workout>(this._dbPath, ref => ref
      .where('isArchiv', '==', false)
      .where('userId', '==', userKey)
    ).valueChanges();
  }

  /**
   *
   *
   *
   * @param key from Workout
   * @returns workout Object
   */
  public fetchByKey(key: string):Observable<I_Workout | undefined> {
    return this._afs.doc<I_Workout>(`${this._dbPath}/${key}`)
    .valueChanges({idField: 'key'})
    .pipe(
      take(1),
    );
  }

  public create(workout: I_Workout): string | undefined {
    const key = this._afs.createId();
    workout['key'] = key;
    this._workoutCollection.doc(key).set(workout);
    return key;
  }

  public edit(workout: I_Workout): Promise<void> {
    return this._workoutCollection.doc(workout.key).update(workout);
  }

  public del(key: string): Promise<void> {
    return this._workoutCollection.doc(key).delete();
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
