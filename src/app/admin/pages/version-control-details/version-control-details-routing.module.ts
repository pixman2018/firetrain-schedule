import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VersionControlDetailsPage } from './version-control-details.page';

const routes: Routes = [
  {
    path: '',
    component: VersionControlDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VersionControlDetailsPageRoutingModule {}
