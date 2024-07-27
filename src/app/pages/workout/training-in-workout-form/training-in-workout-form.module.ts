import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingInWorkoutFormPageRoutingModule } from './training-in-workout-form-routing.module';

import { TrainingInWorkoutFormPage } from './training-in-workout-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingInWorkoutFormPageRoutingModule
  ],
  declarations: [TrainingInWorkoutFormPage]
})
export class TrainingInWorkoutFormPageModule {}
