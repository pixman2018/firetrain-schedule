import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingsInWorkoutListPageRoutingModule } from './trainings-in-workout-list-routing.module';

import { TrainingsInWorkoutListPage } from './trainings-in-workout-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingsInWorkoutListPageRoutingModule,
    SharedModule,
  ],
  declarations: [TrainingsInWorkoutListPage]
})
export class TrainingsInWorkoutListPageModule {}
