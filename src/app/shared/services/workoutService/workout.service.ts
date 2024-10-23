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

  private _usersDbPath: string = '/users';
  private _workoutDbPath: string = '/workouts';

  private _userCollection: AngularFirestoreCollection<I_Workout>;

  constructor(
    private readonly _router: Router,
    private readonly _afs: AngularFirestore,
  ) {
    this._userCollection = _afs.collection<I_Workout>(this._usersDbPath);

    this._constructComponent();
  }

  /**
   *
   * @public
   * @returns Observable<I_Workout[] | undefined>
   * @memberof WorkoutService
   *
   * @description
   * fetch all workout from the user by user ID
   *
   */
  public fetchAll():Observable<I_Workout[] | undefined>  {
    const userKey: string  = window.sessionStorage.getItem('uid')!;
    return this._userCollection
      .doc(userKey)
      .collection<I_Workout>(this._workoutDbPath, ref => ref
        .where('isArchiv', '==', false)
        .where('userId', '==', userKey)
      ).valueChanges();
  }

  /**
   *
   * @public
   * @param key from Workout
   * @returns workout Object
   * @memberof WorkoutService
   *
   * @description
   * fetch a training in workout from the current user
   *
   */
  public fetchByKey(key: string):Observable<I_Workout[] | undefined> {
    const userKey: string  = window.sessionStorage.getItem('uid')!;
    console.log('key', key, ' userKey ', userKey)
    return this._userCollection
      .doc(userKey)
      .collection<I_Workout>(this._workoutDbPath, ref => ref
        .where('key', '==', key)
      ).valueChanges()
      .pipe(
        take(1),
      );
  }

  /**
   *
   * @public
   * @param workout from Workout
   * @returns  string | undefined
   * @memberof WorkoutService
   *
   * @description
   * create a training in workout for the current user
   *
   */
  public create(workout: I_Workout): string | undefined {
    const key = this._afs.createId();
    workout['key'] = key;
    const userKey: string  = window.sessionStorage.getItem('uid')!;
    this._userCollection
      .doc(userKey)
      .collection<I_Workout>(this._workoutDbPath)
      .doc(key)
      .set(workout);
    return key;
  }

    /**
   *
   * @public
   * @param workout
   * @memberof WorkoutService
   *
   * @description
   * edit a training in workout for the current user
   *
   */
  public edit(workout: I_Workout): Promise<void> {
    const userKey: string  = window.sessionStorage.getItem('uid')!;
    return this._userCollection
      .doc(userKey)
      .collection<I_Workout>(this._workoutDbPath)
      .doc(workout.key)
      .update(workout);
  }

      /**
   *
   * @public
   * @param key from Workout
   * @memberof WorkoutService
   *
   * @description
   * delete a training in workout for the current user
   *
   */
  public del(key: string): Promise<void> {
    const userKey: string  = window.sessionStorage.getItem('uid')!;
    return this._userCollection
      .doc(userKey)
      .collection<I_Workout>(this._workoutDbPath)
      .doc(key)
      .delete();
  }

        /**
   *
   * @public
   * @memberof WorkoutService
   *
   * @description
   * is user id not found then redirect to auth
   *
   */
  private async _constructComponent() {
    const userId =  sessionStorage.getItem('uid') ;
    if (!userId) {
      this._router.navigateByUrl('/auth', { replaceUrl: true });
    }
  }
}
