import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingFormPage } from './training-form.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingFormPageRoutingModule {}
