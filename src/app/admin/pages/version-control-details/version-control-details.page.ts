import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModalController, Platform } from '@ionic/angular';

// Model
import { VersionControlI } from '../../model/VersionControlI';

@Component({
  selector: 'app-version-control-details',
  templateUrl: './version-control-details.page.html',
  styleUrls: ['./version-control-details.page.scss'],
})
export class VersionControlDetailsPage implements OnInit {

  @Input() versionControlPrev: VersionControlI | null = null;

  protected currentVersion: string = environment.appVersion;
  protected translucent: boolean = true;

  constructor(
  private readonly _platform: Platform,
  private _modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this._initComponent();
  }


  protected onClose() {
    return this._modalCtrl.dismiss(null, 'cancel');
  }

  private _initComponent(): void {
    this._platform.is('ios') ? this.translucent = false :   this.translucent = true;
  }

}
