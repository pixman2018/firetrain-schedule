import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

// data
import * as build from 'src/build-version.json';
// service
import { VersionControlService } from '../../services/version-control.service/version-control.service';
// model
import {  VersionControlI } from '../../model/VersionControlI';
import { I_Build } from 'src/app/shared/interfaces/I_Build';



@Component({
  selector: 'app-version-control',
  templateUrl: './version-control.page.html',
  styleUrls: ['./version-control.page.scss'],
})
export class VersionControlPage implements OnInit {
  protected versionControl!: VersionControlI;
  protected buildObj: I_Build = build;
  protected buildVersion: string = environment.appVersion;

  constructor(
    private _router: Router,
    private _versionControlService: VersionControlService
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  /**
   *
   * create a new version in the db
   *
   */
  protected onAddNewVersion() {
    this._versionControlService.create(this._createAppObj());
  }

  /**
   *
   * redirect to the add logitems
   *
   */
  protected onAddLogItem(): void {
    this._router.navigateByUrl(
      `/logitems-form/add?buildVersion=${this.versionControl?.build?.version}`,
      { replaceUrl: true }
    );
  }

  /**
   *
   * fetches the last versioncolntrol as of the databnk
   * that is not yet published
   *
   */
  private _fetchByIsNotPublished(): void {
    this._versionControlService
      .fetchByIsNotPublished()
      .subscribe((app: VersionControlI[]) => {
        console.log('versionControl', app);
        this.versionControl = app[0];
      });
  }


  /**
   *
   * create a default Version Controll Object
   *
   * @returns VersionControlI
   *
   */
  private _createAppObj(): VersionControlI {
    return {
      namespace: 'app',
      items: {
        bugs: [],
        feactures: [],
      },
      isPublished: false,
      build: {
        version: environment.appVersion,
        VersionNo: this.buildObj.buildNo,
        timeStamp: this.buildObj.timeStamp,
      },
      createdTstamp: Date.now(),
      updatedTstamp: Date.now(),
    };
  }

  /**
   * fetches all version controls from the database that are not yet published
   */
  private _initComponent() {
    this._fetchByIsNotPublished();
  }
}
