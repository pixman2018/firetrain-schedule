import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { first, Observable } from 'rxjs';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

// interface
import { I_TrainingInWorkout } from '../../interfaces/I_TrainingInWorkout';
import { I_Workout } from '../../interfaces/I_Workout';
import { getCountFromServer, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TrainingInWorkoutService {

  private _dbPath: string = '/workouts';
  private _workoutCollection: AngularFirestoreCollection<I_Workout>;
  private _userId: string = '-1';

  constructor(
    private readonly _router: Router,
    private readonly _afs: AngularFirestore,
  ) {
    this._constructComponent();
    this._workoutCollection = _afs.collection<I_Workout>(this._dbPath);
  }

  public fetchAllTrainingInWorkout(workoutkey: string): Observable<I_TrainingInWorkout[]> {
    return this._workoutCollection
      .doc(workoutkey)
      .collection<I_TrainingInWorkout>('trainings', ref => ref
        .where('userKey', '==', this._userId)
        .orderBy('created')
      )
      .valueChanges();
   }

   public fetchTrainingByKey(workoutkey: string, trainingKey: string): Observable<I_TrainingInWorkout[]> {

    const collection = this._workoutCollection
      .doc(workoutkey)
      .collection<I_TrainingInWorkout>('trainings', ref => ref
        .where('userKey', '==', this._userId)
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

   private async _constructComponent() {
    const userId =  sessionStorage.getItem('uid') ;
    if (userId) {
      this._userId = userId;
    } else {
      this._router.navigateByUrl('/auth', { replaceUrl: true });
    }
  }
}
