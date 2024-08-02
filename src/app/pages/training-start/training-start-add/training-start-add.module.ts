import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingStartAddPageRoutingModule } from './training-start-add-routing.module';

import { TrainingStartAddPage } from './training-start-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingStartAddPageRoutingModule
  ],
  declarations: [TrainingStartAddPage]
})
export class TrainingStartAddPageModule {}
