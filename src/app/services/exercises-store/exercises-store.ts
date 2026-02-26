import { Injectable, Signal, signal } from '@angular/core';
// db
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { convertSnaps, convertSnap } from 'src/db/db-until';
// service models
import { I_Practic } from 'src/app/models/I_exercises.model';
import { HttpBasesAbstractClass } from 'src/db/http-basis-abstract-class';

@Injectable({
  providedIn: 'root',
})
export class exercisesStore extends HttpBasesAbstractClass {
  private _exercises = signal<any[]>([]);

  constructor() {
    super();
    this.dbPath = 'exercisess';
    this.colRef = collection(this.firestore, this.dbPath);
  }

  public get exercises(): Signal<Required<I_Practic[]>> {
    return this._exercises.asReadonly();
  }

  public override async getAll(): Promise<Required<I_Practic[] | []>> {
    try {
      const snapshot = await getDocs(this.colRef);
      const data: any[] = convertSnaps(snapshot);
      this._exercises.set(data);
      return data;
    } catch (error) {
      console.error('Error by load from all exercisess');
      return [];
    }
  }

  public async getByCategory(
    category: string,
  ): Promise<Required<I_Practic[] | []>> {
    if (!category) {
      return [];
    }

    try {
      const q = query(this.colRef, where('category', '==', category));
      const snapshot = await getDocs(q);

      return convertSnaps(snapshot);
    } catch (error) {
      console.log('category', category);
      console.error('Error by load from exercisess by category');
      console.log(error);
      return [];
    }
  }

  public override async getById(
    id: string,
  ): Promise<Required<I_Practic | null>> {
    try {
      const practicRef = doc(this.firestore, `${this.dbPath}/${id}`);
      const snapshot = await getDoc(practicRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = convertSnap<Required<I_Practic>>(snapshot);
      return data;
    } catch (error) {
      console.error(`Error by get pratic by ID: "${id}"`);
      return null;
    }
  }

  public override async create(exercises: I_Practic): Promise<string> {
    try {
      const docRef = await addDoc(this.colRef, exercises);
      const exercisesWithId: any = {
        ...exercises,
        id: docRef.id,
      };
      this._setexercises(exercisesWithId);
      return docRef.id;
    } catch (error) {
      console.error('Error by create a new exercises', error);
      throw error;
    }
  }

  public override edit(exercises: I_Practic, id: string): Promise<void> {
    try {
      this._setexercises(exercises);
      const practicRef = doc(this.firestore, `${this.dbPath}/${id}`);
      return updateDoc(practicRef, { ...exercises });
    } catch (error) {
      console.error('Error by create a new practive:', error);
      throw error;
    }
  }

  public override async delete(id: string): Promise<void> {
    try {
      const practicRef = doc(this.firestore, `${this.dbPath}/${id}`);
      return await deleteDoc(practicRef);
    } catch (error) {
      console.error('Error by del practive:', error);
      throw error;
    }
  }

  private _setexercises(exercises: I_Practic) {
    this._exercises.update((currentexercises) => [
      ...currentexercises,
      exercises,
    ]);
  }
}
