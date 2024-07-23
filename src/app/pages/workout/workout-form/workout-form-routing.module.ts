import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutFormPage } from './workout-form.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutFormPageRoutingModule {}
