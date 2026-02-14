import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { DbUpdate } from 'src/app/services/db-update/db-update';
import { PracticeStore } from 'src/app/services/practice-store/practice-store';

@Injectable()
export class InitPractice {
  private _firestore = inject(Firestore);
  private _practiceStore = inject(PracticeStore);
  private _dbUpdateService = inject(DbUpdate);

  private _categories: string[] = ['Rücken', 'Brust', 'Bizeps'];
  private _practices: any[] = [
    {
      name: 'Pull ups',
      category: this._categories[0],
    },
    {
      name: 'Chin ups',
      category: this._categories[0],
    },
    {
      name: 'Latzug breit',
      category: this._categories[0],
    },
    {
      name: 'Rudern unilateral',
      category: this._categories[0],
    },
    {
      name: 'Breites Rudern',
      category: this._categories[0],
    },
    {
      name: 'Reverse Butterfly',
      category: this._categories[0],
    },
    {
      name: 'Rückenstrecker',
      category: this._categories[0],
    },
    {
      name: 'Brustpresse',
      category: this._categories[1],
    },
    {
      name: 'Butterfly',
      category: this._categories[1],
    },
    {
      name: 'Positives Bankdrücken  Kh',
      category: this._categories[1],
    },
    {
      name: 'Cross Over Maschine',
      category: this._categories[1],
    },
    {
      name: 'Drag Culs kabel',
      category: this._categories[2],
    },
    {
      name: 'Pricha Carls Maschine',
      category: this._categories[2],
    },
  ];

  public async _addAllPractices(): Promise<void> {
    this._dbUpdateService.clearCollection(
      'practices',
      collection(this._firestore, 'practices'),
    );
    this._practices.forEach(async (practice) => {
      const result = await this._practiceStore.create(practice);
      if (result) {
        console.log(`create practice with the ID ${result}. `);
      }
    });
  }
}
