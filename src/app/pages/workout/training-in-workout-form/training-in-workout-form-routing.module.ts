import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingInWorkoutFormPage } from './training-in-workout-form.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingInWorkoutFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingInWorkoutFormPageRoutingModule {}
