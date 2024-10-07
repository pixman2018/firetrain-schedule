import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { versionControlistPage } from './version-control-list.page';

const routes: Routes = [
  {
    path: '',
    component: versionControlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class versionControlistPageRoutingModule {}
