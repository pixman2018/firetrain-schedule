import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingsInWorkoutListPage } from './trainings-in-workout-list.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingsInWorkoutListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingsInWorkoutListPageRoutingModule {}
