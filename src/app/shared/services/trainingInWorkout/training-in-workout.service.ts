import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

// interface
import { I_TrainingInWorkout } from '../../interfaces/I_TrainingInWorkout';
import { I_Workout } from '../../interfaces/I_Workout';


@Injectable({
  providedIn: 'root'
})
export class TrainingInWorkoutService {

  private _dbPath: string = '/workouts';
  private _workoutCollection: AngularFirestoreCollection<I_Workout>;

  constructor(
    private readonly _afs: AngularFirestore,
  ) {
    this._workoutCollection = _afs.collection<I_Workout>(this._dbPath);
  }

  public fetchAllTrainingInWorkout(workoutkey: string): Observable<I_TrainingInWorkout[]> {
    return this._workoutCollection
      .doc(workoutkey)
      .collection<I_TrainingInWorkout>('trainings', ref => ref
        .where('userKey', '==', window.sessionStorage.getItem('uid'))
        .orderBy('created')
      )
      .valueChanges();
   }

   public fetchTrainingByKey(workoutkey: string, trainingKey: string, userKey: string): Observable<I_TrainingInWorkout[]> {
    const userId =  sessionStorage.getItem('uid') ;
    console.log('userKey', userKey)
    const collection = this._workoutCollection
      .doc(workoutkey)
      .collection<I_TrainingInWorkout>('trainings', ref => ref
        .where('userKey', '==', userKey)
        .where('key', '==', trainingKey)
      )
      .valueChanges()

      return collection;
   }

   public createTrainingInWorkout(trainingInWorkout: I_TrainingInWorkout ): string {
    const key = this._afs.createId();
    trainingInWorkout['key'] = key;

    this._workoutCollection
      .doc(trainingInWorkout.workoutkey)
      .collection<I_TrainingInWorkout>('trainings')
      .doc(key)
      .set(trainingInWorkout)
      return key;
   }

   public editTrainingInWorkout(trainingInWorkout: I_TrainingInWorkout): Promise<void> {
    return this._workoutCollection
      .doc(trainingInWorkout.workoutkey)
      .collection<I_TrainingInWorkout>('trainings')
      .doc(trainingInWorkout.key)
      .update(trainingInWorkout)
   }

   public delTrainingInWorkout(workoutKey: string, trainingKey: string): Promise<void>   {
      return this._workoutCollection
      .doc(workoutKey)
      .collection<I_TrainingInWorkout>('trainings')
      .doc(trainingKey)
      .delete();
   }

}
