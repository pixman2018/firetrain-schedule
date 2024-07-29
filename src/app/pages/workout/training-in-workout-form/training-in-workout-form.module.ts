import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingInWorkoutFormPageRoutingModule } from './training-in-workout-form-routing.module';

import { TrainingInWorkoutFormPage } from './training-in-workout-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TrainingInWorkoutFormPageRoutingModule,
    SharedModule,
  ],
  declarations: [TrainingInWorkoutFormPage]
})
export class TrainingInWorkoutFormPageModule {}
