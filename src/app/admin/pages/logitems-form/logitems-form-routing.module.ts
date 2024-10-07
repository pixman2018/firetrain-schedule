import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogitemsFormPage } from './logitems-form.page';

const routes: Routes = [
  {
    path: '',
    component: LogitemsFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogitemsFormPageRoutingModule {}
