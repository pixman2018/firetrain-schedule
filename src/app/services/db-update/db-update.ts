import { inject, Injectable } from '@angular/core';
import { Firestore, Query } from '@angular/fire/firestore';
import {
  doc,
  DocumentData,
  getDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { convertSnap } from 'src/db/db-until';

@Injectable({
  providedIn: 'root',
})
export class DbUpdate {
  private _firestore = inject(Firestore);

  public async updateAllRecipes(
    newRecipe: {},
    collectionPath: string,
    colRef: Query<unknown, DocumentData>,
  ) {
    const snapshot = await getDocs(colRef);
    // init batch
    const batch = writeBatch(this._firestore);
    try {
      snapshot.forEach(async (document) => {
        const docRef = doc(this._firestore, `${collectionPath}/${document.id}`);
        const snapshot = await getDoc(docRef);
        const data: any = convertSnap(snapshot);
        if (data) {
          data.updatedAt = Date.now();
        }
        // document add batch
        batch.update(docRef, { ...newRecipe });
      });

      // Submit all changes at once
      await batch.commit();
      console.log('Alle Rezepte wurden aktualisiert!');
    } catch (error) {
      console.log('Error by upadate all recipess');
      throw error;
    }
  }
  public async clearCollection(
    collectionPath: string,
    colRef: Query<unknown, DocumentData>,
  ): Promise<void> {
    try {
      const snapshot = await getDocs(colRef);
      const batch = writeBatch(this._firestore);

      snapshot.docs.forEach((document) => {
        const docRef = doc(this._firestore, `${collectionPath}/${document.id}`);
        batch.delete(docRef);
      });

      await batch.commit();
      console.log(`delete all ${colRef} in ${collectionPath}.`);
    } catch (error) {
      console.log('Error by delete all practice.');
      throw error;
    }
  }
}
