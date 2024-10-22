import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
// interface
import { I_Training } from '../../interfaces/I_Training';


@Injectable({
  providedIn: 'root',
})
export class TrainingService {

  private _dbPath: string = '/trainings';
  private _trainsCollection: AngularFirestoreCollection<I_Training>;

  constructor(private _afs: AngularFirestore) {
    this._trainsCollection = _afs.collection(this._dbPath);
  }

  /**
   *
   * @public
   * @returns  Observable<I_Training>
   *
   * @description
   * fetch all trainings
   */
  public fetchAll(): Observable<I_Training[]> {
    return this._trainsCollection.valueChanges();
  }

  /**
   *
   * @public
   * @param key
   * @returns  Observable<I_Training | undefined>
   *
   * @description
   * fetch training by key
   */
  public fetchByKey(key: string): Observable<I_Training | undefined> {
    return this._afs
      .doc<I_Training>(`${(this, this._dbPath)}/${key}`)
      .valueChanges({ idField: key })
      .pipe(take(1));
  }

  /**
   *
   * @public
   * @param searchString
   * @returns Observable<I_Training[]
   *
   * @description
   * fetch search trainings
   */
  public search(searchString: string): Observable<I_Training[]> {
    const request$ = this._afs.collection<I_Training>(this._dbPath, (ref) =>
      ref
        .orderBy('name', 'asc')
        .startAt(searchString)
        .endAt(searchString.trim() + '\uf8ff')
    );
    return request$.valueChanges();
  }

  /**
   *
   * @public
   * @param categoryId
   * @returns Observable<I_Training[]
   *
   * @description
   * fetch trainings by "category"
   */
  public filter(categoryId: string): Observable<I_Training[]> {
    const request = this._afs.collection<I_Training>(this._dbPath, (ref) =>
      ref.orderBy('name').where('categoryId', 'in', categoryId)
    );

    return request.valueChanges();
  }

  /**
   *
   * @public
   * @param categoryId
   * @param searchString
   * @returns Observable<I_Training[]
   *
   * @description
   * fetch trainings by "category" and search
   *
   */
  public filterAndSearch(
    categoryId: string,
    searchString: string
  ): Observable<I_Training[]> {
    const request = this._afs.collection<I_Training>(this._dbPath, (ref) =>
      ref
        .orderBy('name')
        .startAt(searchString)
        .endAt(searchString + '\uf8ff')
        .where('categoryId', 'in', categoryId)
    );

    return request.valueChanges();
  }

  /**
   *
   * @public
   * @param training
   * @type {string}
   * @returns string
   * id from the add training
   * @memberof TrainingService
   *
   * @description
   * add a training in db
   *
   */
  public create(training: I_Training): string {
    const id = this._afs.createId();
    training['key'] = id;
    this._trainsCollection.doc(id).set(training);
    return id;
  }

  /**
   *
   * @public
   * @type {void}
   * @memberof TrainingService
   *
   * @description
   * edit a training in db
   *
   */
  public edit(training: I_Training): Promise<void> {
    return this._trainsCollection.doc(training.key).update(training);
  }

  /**
   *
   * @public
   * @type {void}
   * @memberof TrainingService
   *
   * @description
   * delete a training by key
   *
   */
  public del(key: string): Promise<void> {
    return this._trainsCollection.doc(key).delete();
  }
}
