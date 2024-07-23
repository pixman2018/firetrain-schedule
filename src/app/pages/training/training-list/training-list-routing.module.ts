import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingListPage } from './training-list.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingListPageRoutingModule {}
