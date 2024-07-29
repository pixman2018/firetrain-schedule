import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, take } from 'rxjs';

import { AngularFirestore, AngularFirestoreCollection, DocumentData } from '@angular/fire/compat/firestore';
// interfcae
import { WorkoutI } from '../../interfaces/Workout';
import { TrainingInWorkoutI } from '../../interfaces/TrainingInWorkoutI';


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

  /*
  ********************************************************************************
  *****
  ***
  * Training in Workout
  ***
  *****
  ********************************************************************************
  */
 public fetchAllTrainingInWorkout(workoutkey: string): Observable<DocumentData[]> {
  return this._workoutCollection
    .doc(workoutkey)
    .collection('trainings')
    .valueChanges();
 }

 public createTrainingInWorkout(trainingInWorkout: TrainingInWorkoutI): string {
  const key = this._afs.createId();
  trainingInWorkout['key'] = key;
  this._workoutCollection
    .doc(trainingInWorkout.workoutkey)
    .collection('trainings')
    .add(trainingInWorkout)
    return key;
 }

 public updateTrainingInWorkout(trainingInWorkout: TrainingInWorkoutI): Promise<void> {
  return this._workoutCollection
    .doc(trainingInWorkout.workoutkey)
    .collection('trainings')
    .doc(trainingInWorkout.key)
    .update(trainingInWorkout)
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
