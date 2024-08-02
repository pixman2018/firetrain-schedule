import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingStartAnalysisPageRoutingModule } from './training-start-analysis-routing.module';

import { TrainingStartAnalysisPage } from './training-start-analysis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingStartAnalysisPageRoutingModule
  ],
  declarations: [TrainingStartAnalysisPage]
})
export class TrainingStartAnalysisPageModule {}
