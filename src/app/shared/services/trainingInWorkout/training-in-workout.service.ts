import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

// pipe
import { UcfirstPipe } from '../../pipes/ucFirst/ucfirst.pipe';
// interface
import { I_TrainingInWorkout } from '../../interfaces/I_TrainingInWorkout';
import { I_Workout } from '../../interfaces/I_Workout';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';


@Injectable({
  providedIn: 'root',
})
export class TrainingInWorkoutService {
  private _dbPath: string = '/users';
  private _trainingsInWorkoutPath: string = '/trainingsInWorkout';

  private _userCollection: AngularFirestoreCollection<I_Workout>;

  constructor(private readonly _afs: AngularFirestore) {
    this._userCollection = _afs.collection<I_Workout>(this._dbPath);
  }

  /**
   *
   * @protected
   * @param workoutkey
   * @returns Observable<I_TrainingInWorkout[]>
   * @memberof TrainingInWorkoutService
   *
   * @description
   * fetch all training in workout from this user
   *
   */
  public fetchAllTrainingInWorkout(
    workoutkey: string
  ): Observable<I_TrainingInWorkout[]> {
    const userKey: string = window.sessionStorage.getItem('uid')!;
    return this._userCollection
      .doc(userKey)
      .collection<I_TrainingInWorkout>(this._trainingsInWorkoutPath, (ref) =>
        ref.where('userKey', '==', userKey)
        .where('workoutKeys', 'array-contains', workoutkey)
        .orderBy('created')
      )
      .valueChanges();
  }

  /**
   *
   * @protected
   * @param workoutkey
   * @param trainingKey
   * @param userKey
   * @returns Observable<I_TrainingInWorkout[]>
   * @memberof TrainingInWorkoutService
   *
   * @description
   * fetch a training in workout from this user and by key
   *
   */
  public fetchTrainingByKey(
    workoutkey: string,
    trainingKey: string,
    userKey: string
  ): Observable<I_TrainingInWorkout[]> {
    console.log('workoutkey', workoutkey, 'trainingKey', trainingKey, 'userKey', userKey)
    const collection = this._userCollection
      .doc(userKey)
      .collection<I_TrainingInWorkout>(this._trainingsInWorkoutPath, (ref) =>
        ref.where('userKey', '==', userKey)
        .where('key', '==', trainingKey)
        .where('workoutKeys', 'array-contains', workoutkey)
      )
      .valueChanges();
    return collection;
  }

  /**
   *
   * @protected
   * @param name
   * @returns Observable<I_TrainingInWorkout[]>
   * @memberof TrainingInWorkoutService
   *
   * @description
   * fetch a training in workout from this user and by name
   *
   */
  public fetchTrainingByName(name: string): Observable<I_TrainingInWorkout[]> {
    const userKey: string = window.sessionStorage.getItem('uid')!;
    const ucFirst = new UcfirstPipe();
    const collection = this._userCollection
      .doc(userKey)
      .collection<I_TrainingInWorkout>(this._trainingsInWorkoutPath, (ref) =>
        ref.where('name', '==', ucFirst.transform(name, true))
      ).valueChanges()
        .pipe(
          first()
        );
        collection.subscribe((t) => {
        });
      return collection;
  }

  /**
   *
   * @protected
   * @param trainingInWorkout
   * @returns string
   * @memberof TrainingInWorkoutService
   *
   * @description
   * create for the current user a new training in workout
   *
   */
  public createTrainingInWorkout(
    trainingInWorkout: I_TrainingInWorkout
  ): string {
    const userId: string = window.sessionStorage.getItem('uid')!;
    const key = this._afs.createId();
    trainingInWorkout['key'] = key;

    this._userCollection
      .doc(userId)
      .collection<I_TrainingInWorkout>(this._trainingsInWorkoutPath)
      .doc(key)
      .set(trainingInWorkout);
    return key;
  }

  /**
   *
   * @protected
   * @param trainingInWorkout
   * @memberof TrainingInWorkoutService
   *
   * @description
   * edit for the current user the training in workout
   *
   */
  public editTrainingInWorkout(
    trainingInWorkout: I_TrainingInWorkout
  ): Promise<void> {
    const userId: string = window.sessionStorage.getItem('uid')!;
    return this._userCollection
      .doc(userId)
      .collection<I_TrainingInWorkout>(this._trainingsInWorkoutPath)
      .doc(trainingInWorkout.key)
      .update(trainingInWorkout);
  }

  /**
   *
   * @protected
   * @param workoutKey
   * @memberof TrainingInWorkoutService
   *
   * @description
   * delete for the current user the training in workout by key
   *
   */
  public delTrainingInWorkout(
    workoutKey: string,
    trainingKey: string
  ): Promise<void> {
    const userId: string = window.sessionStorage.getItem('uid')!;
    return this._userCollection
      .doc(userId)
      .collection<I_TrainingInWorkout>(this._trainingsInWorkoutPath)
      .doc(trainingKey)
      .delete();
  }

   /**
   *
   * @public
   * @static
   * @param authService
   * @returns AsyncValidatorFn
   * @memberof AuthService
   *
   * @description
   * Checks if the training name already exists in the database
   *
   */
   public static trainingExists(trainingInWorkoutService: TrainingInWorkoutService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return trainingInWorkoutService.fetchTrainingByName(control.value).pipe(
        map((training) => {
          console.log('validator', training.length > 0 ? { trainingExists: true } : null);
          return training.length > 0 ? { trainingExists: true } : null;
        }),
        first()
      );
    };
  }
}
