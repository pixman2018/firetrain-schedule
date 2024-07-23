import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutFormPageRoutingModule } from './workout-form-routing.module';

import { WorkoutFormPage } from './workout-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WorkoutFormPageRoutingModule,
    SharedModule,
  ],
  declarations: [WorkoutFormPage]
})
export class WorkoutFormPageModule {}
