import { InjectionToken, Provider } from '@angular/core';

export const exercisesCategoryOptioms: string[] = [
  'Brust',
  'Rücken',
  'Beine',
  'Arme',
  'Schulter',
  'Core',
];

export const EXERCISES_CATEGORY_OPTIONS = new InjectionToken<string[]>(
  'exercises-category-optioms',
);

export const exercisesCategoryOptiomsProvider: Provider = {
  provide: EXERCISES_CATEGORY_OPTIONS,
  useValue: exercisesCategoryOptioms,
};
