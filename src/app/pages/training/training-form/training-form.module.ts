import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingFormPageRoutingModule } from './training-form-routing.module';

import { TrainingFormPage } from './training-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingFormPageRoutingModule
  ],
  declarations: [TrainingFormPage]
})
export class TrainingFormPageModule {}
