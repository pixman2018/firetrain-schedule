import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingListPageRoutingModule } from './training-list-routing.module';

import { TrainingListPage } from './training-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingListPageRoutingModule,
    SharedModule,
  ],
  declarations: [TrainingListPage]
})
export class TrainingListPageModule {}
