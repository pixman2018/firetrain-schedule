import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingFormPageRoutingModule } from './training-form-routing.module';

import { TrainingFormPage } from './training-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TrainingFormPageRoutingModule,
    SharedModule,
  ],
  declarations: [TrainingFormPage]
})
export class TrainingFormPageModule {}
