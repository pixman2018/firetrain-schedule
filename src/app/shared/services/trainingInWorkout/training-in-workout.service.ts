import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

// interface
import { TrainingInWorkoutI } from '../../interfaces/TrainingInWorkoutI';
import { WorkoutI } from '../../interfaces/Workout';

@Injectable({
  providedIn: 'root'
})
export class TrainingInWorkoutService {

  private _dbPath: string = '/workouts';
  private _workoutCollection: AngularFirestoreCollection<WorkoutI>;
  private _userId: string = '-1';

  constructor(
    private readonly _router: Router,
    private readonly _afs: AngularFirestore,
  ) {
    this._constructComponent();
    this._workoutCollection = _afs.collection<WorkoutI>(this._dbPath);
  }

  public fetchAllTrainingInWorkout(workoutkey: string): Observable<TrainingInWorkoutI[]> {
    return this._workoutCollection
      .doc(workoutkey)
      .collection<TrainingInWorkoutI>('trainings', ref => ref
        .where('userKey', '==', this._userId)
        .orderBy('order', 'desc')
      )
      .valueChanges();
   }

   public fetchTrainingByKey(workoutkey: string, trainingKey: string): Observable<TrainingInWorkoutI[]> {
    return this._workoutCollection
      .doc(workoutkey)
      .collection<TrainingInWorkoutI>('trainings', ref => ref
        .where('userKey', '==', this._userId)
        .where('key', '==', trainingKey)
      )
      .valueChanges();
   }

   public createTrainingInWorkout(trainingInWorkout: TrainingInWorkoutI): string {
    const key = this._afs.createId();
    trainingInWorkout['key'] = key;
    this._workoutCollection
      .doc(trainingInWorkout.workoutkey)
      .collection<TrainingInWorkoutI>('trainings')
      .doc(key)
      .set(trainingInWorkout)
      return key;
   }

   public editTrainingInWorkout(trainingInWorkout: TrainingInWorkoutI): Promise<void> {
    return this._workoutCollection
      .doc(trainingInWorkout.workoutkey)
      .collection<TrainingInWorkoutI>('trainings')
      .doc(trainingInWorkout.key)
      .update(trainingInWorkout)
   }

   public delTrainingInWorkout(workoutKey: string, trainingKey: string): Promise<void>   {
      return this._workoutCollection
      .doc(workoutKey)
      .collection<TrainingInWorkoutI>('trainings')
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
