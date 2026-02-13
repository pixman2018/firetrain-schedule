import { inject } from '@angular/core';

import { Firestore, DocumentData, DocumentReference } from '@angular/fire/firestore';

export abstract class HttpBasesAbstractClass {
  protected firestore = inject(Firestore);
  protected dbPath: string = '';

  constructor() {}

  public abstract getAll(): Promise<{}[]>;
  public abstract getById(id: string): Promise<{} | null>;
  public abstract create(item: any): Promise<DocumentReference<DocumentData> | {}>;
  public abstract edit(changes: Partial<any>, id: string): Promise<void>;
  public abstract delete(id: string): Promise<void>;
}
