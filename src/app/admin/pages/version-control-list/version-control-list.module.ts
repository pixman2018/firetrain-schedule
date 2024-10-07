import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { versionControlistPageRoutingModule } from './version-control-list-routing.module';

import { versionControlistPage } from './version-control-list.page';
import { VersionControlDetailsPage } from '../version-control-details/version-control-details.page'
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    versionControlistPageRoutingModule,
    SharedModule,
  ],
  declarations: [versionControlistPage, VersionControlDetailsPage],
  exports: [VersionControlDetailsPage]
})
export class versionControlistPageModule {}
