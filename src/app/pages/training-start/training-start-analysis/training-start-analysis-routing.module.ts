import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingStartAnalysisPage } from './training-start-analysis.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingStartAnalysisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingStartAnalysisPageRoutingModule {}
