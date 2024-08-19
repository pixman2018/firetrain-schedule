import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingStartListPageRoutingModule } from './training-start-list-routing.module';

import { TrainingStartListPage } from './training-start-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TrainingStartListPageRoutingModule,
    SharedModule,
  ],
  declarations: [TrainingStartListPage]
})
export class TrainingStartListPageModule {}
