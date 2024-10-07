import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

// ionic
import { ModalController } from '@ionic/angular';

// services
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { VersionControlService } from '../../services/version-control.service/version-control.service';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
// Model
import { logItemsI, VersionControlI } from '../../model/VersionControlI';
// component
import { VersionControlDetailsPage } from '../version-control-details/version-control-details.page';



@Component({
  selector: 'app-version-control-list',
  templateUrl: './version-control-list.page.html',
  styleUrls: ['./version-control-list.page.scss'],
})
export class versionControlistPage implements OnInit {
  protected versionControl: VersionControlI | null = null;
  protected versionControlPrevs: VersionControlI[] | [] = [];
  protected currentVersion: string = environment.appVersion;
  private _delLogItemObj: {
    versionControl: VersionControlI | null;
    timestamp: number;
    type: any;
  } = {
    versionControl: null,
    timestamp: 0,
    type: '',
  };

  constructor(
    private readonly _router: Router,
    private _modalCtrl: ModalController,
    private readonly _versionControlService: VersionControlService,
    private readonly _helperService: HelperService,
    private readonly _alertService: AlertService
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  /**
   *
   * Go to the prev page
   *
   */
  protected onClickBack(): void {
    this._helperService.backBtn();
  }

  /**
   *
   * Changes isPublished to true in the db
   *
   * @param versionControl
   *
   */
  protected onPublished(versionControl: VersionControlI | null): void {
    if (versionControl) {
      const key: string | undefined = versionControl.key;
      versionControl.isPublished = true;
      if (key) {
        this._versionControlService.update(key, versionControl).then(() => {
          this._alertService.showToast(
            `Version ${versionControl.build.version} veröffendlicht`,
            'top',
            'success'
          );
        });
    }

    } else {
      console.error('versionControl is "null"');
    }
  }

  /**
   *
   * @param versionControlPrev
   */
  protected async onOpenDetails(versionControlPrev: VersionControlI): Promise<void> {
    const modal = await this._modalCtrl.create({
      component: VersionControlDetailsPage,
      componentProps: {
        versionControlPrev: versionControlPrev
      }
    });

    modal.present();


  }

  /**
   *
   * redirect to the logitem form
   *
   * @param timestamp
   * @param type
   *
   */
  protected onEditLogitem(timestamp: number | undefined, type: any): void {
    if (timestamp && type && this.versionControl) {
      this._router.navigateByUrl(
        `/logitems-form/edit?type=${type}&timestamp=${timestamp}&key=${this.versionControl.key}`,
        { replaceUrl: true }
      );
    }
  }

  /**
   *
   * When you click on del logitem,
   * you are asked whether you want to delete the workout.
   * The result of the answer is in the observable
   * from the alet service method 'getConfirmResult()'.
   *
   * @param versionControl
   * @param timestamp
   * @param type
   */
  protected onDelLogItem(
    versionControl: VersionControlI | null,
    timestamp: number | undefined,
    type: any
  ): void {
    if (versionControl) {
      this._alertService.showConfirm(
        'Logitem löschen',
        'Möchtest Du das Logitem wirklich löschen?',
        'warning'
      );
      this._helperService.isItemExist(this._delLogItemObj);
      this._delLogItemObj.versionControl = versionControl;
      this._delLogItemObj.timestamp = timestamp ?? 0;
      this._delLogItemObj.type = type;
    } else {
      console.error('versionControl is "null"');
    }
  }


  /**
   *
   * Delet Logitem from the versionControl
   * and update this
   *
   */
  private _delLogItem(): void {
    if (this._delLogItemObj.versionControl) {
    const itemType: keyof logItemsI = this._delLogItemObj.type;
    const key: string | undefined = this._delLogItemObj.versionControl?.key;
    this._delLogItemObj.versionControl?.items[itemType]?.forEach(
      (item, index) => {
        if (item.timestamp == this._delLogItemObj.timestamp && this._delLogItemObj.versionControl) {
          this._delLogItemObj.versionControl.items[itemType]?.splice(index, 1);
        }

        if (key && this._delLogItemObj.versionControl) {
          this._versionControlService
            .update(key, this._delLogItemObj.versionControl)
            .then(() => {
              this._alertService.showToast(
                'Logitem gelöcht.',
                'top',
                'success'
              );
            });
        }
      }
    );
  }
  }

    /**
   *
   * fetches all version controls from the database
   * that are already published
   *
   */
    private _fetchByIsPublished(): void {
      this._versionControlService
        .fetchByIsPublished()
        .subscribe((app: VersionControlI[]) => {
          this.versionControlPrevs = app;
        });
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
      .subscribe((versionControl: VersionControlI[]) => {
        this.versionControl = versionControl[0];
      });
  }

  /**
   * _fetchAllVersionControls
   * subscribes to the Confirm result
   */
  private _initComponent() {
    this._fetchByIsPublished();
    this._fetchByIsNotPublished();

    this._alertService.getConfirmResult().subscribe((isDel: boolean) => {
      if (isDel) {
        this._delLogItem();
      }
    });
  }
}
