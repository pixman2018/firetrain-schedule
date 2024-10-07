import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { VersionControlI } from '../../model/VersionControlI';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VersionControlService {

  private _dbPath: string = '/app';
  private _trainsCollection: AngularFirestoreCollection<VersionControlI>;

  constructor(private _afs: AngularFirestore,) {
    this._trainsCollection = _afs.collection(this._dbPath);
   }

   public fetchAll():Observable<(VersionControlI & { key: string; })[]> {
    return this._afs.collection<VersionControlI>(this._dbPath, ref =>
      ref.orderBy('build.VersionNo', 'desc')
    ).valueChanges({idField: 'key'});
  }

  public fetchByKey(key: string):Observable<VersionControlI[]> {
    return this._afs.collection<VersionControlI>(this._dbPath, ref =>
      ref.where('key', '==', key)
    ).valueChanges({idField: 'key'});
  }

  public fetchByIsNotPublished():Observable<VersionControlI[]> {
    return this._afs.collection<VersionControlI>(this._dbPath, ref =>
      ref
      .where('isPublished', '==', false)
      .orderBy('build.VersionNo', 'desc')
    ).valueChanges({idField: 'key'});
  }

  public fetchByIsPublished():Observable<VersionControlI[]> {
    return this._afs.collection<VersionControlI>(this._dbPath, ref =>
      ref
      .where('isPublished', '==', true)
      .orderBy('build.VersionNo', 'desc')
    ).valueChanges({idField: 'key'});
  }

  public fetchLastVersionControl():Observable<VersionControlI[]> {
    return this._afs.collection<VersionControlI>(this._dbPath, ref =>
      ref
        .limitToLast(1)
        .orderBy('createdTstamp')
    ).valueChanges({idField: 'key'});
  }

  public create(versionControl: VersionControlI):  string  {
    const id = this._afs.createId();
    versionControl['key'] = id;
    this._trainsCollection.doc(id).set(versionControl);
    return id;
  }

  public update(id: string, versionControl: VersionControlI): Promise<void> {
    return (this._trainsCollection.doc(id).update(versionControl));
  }

  public delete(id: string): Promise<void> {
    return this._trainsCollection.doc(id).delete();
  }
}

