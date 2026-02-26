import { inject, Injectable } from '@angular/core';

import { EXERCISES_CATEGORY_OPTIONS } from 'src/app/models/I_exercisesCategory.model';
import { DbUpdate } from 'src/app/services/db-update/db-update';
import { exercisesStore } from 'src/app/services/exercises-store/exercises-store';

@Injectable()
export class Initexercises {
  private _exercisesStore = inject(exercisesStore);
  private _exercisesCategory = inject(EXERCISES_CATEGORY_OPTIONS);
  private _dbUpdateService = inject(DbUpdate);

  private _categories: string[] = this._exercisesCategory;
  private _exercisess: any[] = [
    {
      name: 'Pull ups',
      category: this._categories[1],
    },
    {
      name: 'Chin ups',
      category: this._categories[1],
    },
    {
      name: 'Latzug breit',
      category: this._categories[1],
    },
    {
      name: 'Rudern unilateral',
      category: this._categories[1],
    },
    {
      name: 'Breites Rudern',
      category: this._categories[1],
    },
    {
      name: 'Reverse Butterfly',
      category: this._categories[1],
    },
    {
      name: 'Rückenstrecker Maschine',
      category: this._categories[5],
    },
    {
      name: 'Brustpresse',
      category: this._categories[0],
    },
    {
      name: 'Butterfly',
      category: this._categories[0],
    },
    {
      name: 'Positives Bankdrücken  Kh',
      category: this._categories[0],
    },
    {
      name: 'Cross Over Maschine',
      category: this._categories[0],
    },
    {
      name: 'Drag Culs kabel',
      category: this._categories[3],
    },
    {
      name: 'Pricha Carls Maschine',
      category: this._categories[3],
    },
    {
      name: 'Beinstrecker unilateral',
      category: this._categories[2],
    },
    {
      name: 'Beinstrecker',
      category: this._categories[2],
    },
    {
      name: 'Beinbeuger unilateral',
      category: this._categories[2],
    },
    {
      name: 'Beinbeuger',
      category: this._categories[2],
    },
    {
      name: 'Hackenschmidt',
      category: this._categories[2],
    },
    {
      name: 'Rumänisches Kreuzheben',
      category: this._categories[2],
    },
    {
      name: 'Auswahlschritten',
      category: this._categories[2],
    },
    {
      name: 'Seitenmuskel Maschine',
      category: this._categories[5],
    },
    {
      name: 'Hochrollen Maschine',
      category: this._categories[5],
    },
    {
      name: 'Seitheben Kabel',
      category: this._categories[4],
    },
    {
      name: 'Seitheben Kh',
      category: this._categories[4],
    },
    {
      name: 'Vorgebautes Seitheben Kh',
      category: this._categories[4],
    },
    {
      name: 'Schulterpressen Lh',
      category: this._categories[4],
    },
    {
      name: 'Trizeps drücken Reverse',
      category: this._categories[3],
    },
    {
      name: 'Trizeps drücken Single',
      category: this._categories[3],
    },
    {
      name: 'Sz-Curls',
      category: this._categories[3],
    },
    {
      name: 'Hammer Curls',
      category: this._categories[3],
    },
    {
      name: 'Positives Bankdrücken Maschine',
      category: this._categories[3],
    },
    {
      name: 'Kabel Cross Oben',
      category: this._categories[3],
    },
    {
      name: 'Bankdrücken Lh',
      category: this._categories[3],
    },
    {
      name: 'Butterfly liegend Maschine',
      category: this._categories[3],
    },
  ];

  public async _addAllexercisess(): Promise<void> {
    this._dbUpdateService.clearCollection('exercisess');
    this._exercisess.forEach(async (exercises) => {
      const result = await this._exercisesStore.create(exercises);
      if (result) {
        console.log(`create exercises with the ID ${result}. `);
      }
    });
  }
}
