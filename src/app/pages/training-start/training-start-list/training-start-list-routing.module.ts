import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingStartListPage } from './training-start-list.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingStartListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingStartListPageRoutingModule {}
