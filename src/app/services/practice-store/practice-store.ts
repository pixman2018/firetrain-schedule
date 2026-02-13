import { inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
} from '@angular/fire/firestore';
import { convertSnaps } from 'src/db/db-until';

@Injectable({
  providedIn: 'root',
})
export class PracticeStore {
  private _firestore = inject(Firestore);
  private _dbPath = 'practices';
  private _colRef = collection(this._firestore, this._dbPath);
  private _practice = signal<any[]>([]);

  public async getAll(): Promise<any[] | []> {
    try {
      const snapshot = await getDocs(this._colRef);
      const data: any[] = convertSnaps(snapshot);
      this._practice.set(data);
      return data;
    } catch (error) {
      console.error('Error by load from all practices');
      return [];
    }
  }

  public async create(practice: any): Promise<string> {
    try {
      const docRef = await addDoc(this._colRef, practice);
      const practiceWithId: any = {
        ...practice,
        id: docRef.id,
      };
      this._setPractice(practiceWithId);
      return docRef.id;
    } catch (error) {
      console.error('Error by create a new practice', error);
      throw error;
    }
  }

  private _setPractice(practice: any) {
    this._practice.update((currentPractice) => [...currentPractice, practice]);
  }
}
