import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingStartListPageRoutingModule } from './training-start-list-routing.module';

import { TrainingStartListPage } from './training-start-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingStartListPageRoutingModule
  ],
  declarations: [TrainingStartListPage]
})
export class TrainingStartListPageModule {}
