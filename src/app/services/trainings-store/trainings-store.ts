import { Injectable, Signal, signal } from '@angular/core';
// db
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';
import { convertSnaps, convertSnap } from 'src/db/db-until';
// service models
import { HttpBasesAbstractClass } from 'src/db/http-basis-abstract-class';
import { I_Training } from 'src/app/models/I_trainings.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingsStore extends HttpBasesAbstractClass {
  private _exercises = signal<any[]>([]);

  constructor() {
    super();
    this.dbPath = 'trainings';
    this.colRef = collection(this.firestore, this.dbPath);
  }

  public get exercises(): Signal<Required<I_Training[]>> {
    return this._exercises.asReadonly();
  }

  public override async getAll(): Promise<Required<I_Training[] | []>> {
    try {
      const snapshot = await getDocs(this.colRef);
      const data: any[] = convertSnaps(snapshot);
      this._exercises.set(data);
      return data;
    } catch (error) {
      console.error('Error by load from all trainings');
      return [];
    }
  }

  public override async getById(
    id: string,
  ): Promise<Required<I_Training | null>> {
    try {
      const practicRef = doc(this.firestore, `${this.dbPath}/${id}`);
      const snapshot = await getDoc(practicRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = convertSnap<Required<I_Training>>(snapshot);
      return data;
    } catch (error) {
      console.error(`Error by get pratic by ID: "${id}"`);
      return null;
    }
  }

  public override async create(exercises: I_Training): Promise<string> {
    try {
      const docRef = await addDoc(this.colRef, exercises);
      const exercisesWithId: any = {
        ...exercises,
        id: docRef.id,
      };
      this._setexercises(exercisesWithId);
      return docRef.id;
    } catch (error) {
      console.error('Error by create a new training', error);
      throw error;
    }
  }

  public override edit(training: I_Training, id: string): Promise<void> {
    try {
      this._setexercises(training);
      const practicRef = doc(this.firestore, `${this.dbPath}/${id}`);
      return updateDoc(practicRef, { ...training });
    } catch (error) {
      console.error('Error by create a new training:', error);
      throw error;
    }
  }

  public override async delete(id: string): Promise<void> {
    try {
      const trainingRef = doc(this.firestore, `${this.dbPath}/${id}`);
      return await deleteDoc(trainingRef);
    } catch (error) {
      console.error('Error by del training:', error);
      throw error;
    }
  }

  private _setexercises(training: I_Training) {
    this._exercises.update((currenttraining) => [...currenttraining, training]);
  }
}
