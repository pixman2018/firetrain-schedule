import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { I_Build } from 'src/app/shared/interfaces/I_Build';

// data
import * as build from 'src/build-version.json';
// interfaces


@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  protected buildObj: I_Build = build;

  constructor(private readonly _modalCtrl: ModalController,) { }

  ngOnInit() {
    console.log('build', this.buildObj.buildNo)
  }

  protected onCancel() {
    return this._modalCtrl.dismiss(null, 'cancel');
  }
}
