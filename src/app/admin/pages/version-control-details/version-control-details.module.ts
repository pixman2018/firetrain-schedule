import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VersionControlDetailsPageRoutingModule } from './version-control-details-routing.module';

import { VersionControlDetailsPage } from './version-control-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VersionControlDetailsPageRoutingModule
  ],
  // declarations: [VersionControlDetailsPage]
})
export class VersionControlDetailsPageModule {}
