import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImprintPageRoutingModule } from './imprint-routing.module';

import { ImprintPage } from './imprint.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ImprintPageRoutingModule
  ],
  declarations: [ImprintPage]
})
export class ImprintPageModule {}
