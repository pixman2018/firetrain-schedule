import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogitemsFormPageRoutingModule } from './logitems-form-routing.module';

import { LogitemsFormPage } from './logitems-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    LogitemsFormPageRoutingModule
  ],
  declarations: [LogitemsFormPage]
})
export class LogitemsFormPageModule {}
