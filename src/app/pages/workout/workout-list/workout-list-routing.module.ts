import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutListPage } from './workout-list.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutListPageRoutingModule {}
