import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VersionControlPageRoutingModule } from './version-control-routing.module';

import { VersionControlPage } from './version-control.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    VersionControlPageRoutingModule
  ],
  declarations: [VersionControlPage]
})
export class VersionControlPageModule {}
