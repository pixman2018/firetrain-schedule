import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

// service
import { VersionControlService } from '../../services/version-control.service/version-control.service';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
// Model
import {
  languageI,
  logItemsI,
  VersionControlI,
} from '../../model/VersionControlI';
import { AlertService } from 'src/app/shared/services/alert/alert.service';

@Component({
  selector: 'app-logitems-form',
  templateUrl: './logitems-form.page.html',
  styleUrls: ['./logitems-form.page.scss'],
})
export class LogitemsFormPage implements OnInit {

  protected logItemsForm: FormGroup = this._createLogItemsForm();
  protected isSubmit: boolean = false;
  protected types: string[] = ['Feactures', 'Bugs'];
  protected formtype: string = 'add';
  private _buildVersion: string = '';

  // edit
  private _type!: keyof logItemsI;
  private _timestamp: number = 0;
  private _key: string = '';

  protected headline: string = '';
  protected versionControl!: VersionControlI;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _fb: FormBuilder,
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
   * submit form redirect to create or edit
   *
   */
  protected onSubmitLogItems(): void {
    this.isSubmit = true;
    if (this.formtype == 'add') {
      this._createLogItems();
    } else if (this.formtype == 'edit') {
      this._editLogItems();
    }
  }

  /**
   *
   * create a new logitem
   *
   */
  private _createLogItems(): void {
    if (this.logItemsForm.valid && this.versionControl.key) {
      const logItems: languageI = {
        de: `${this.logItemsForm.get('logitem')?.value}`,
        en: `${this.logItemsForm.get('logitem')?.value}`,
        timestamp: Date.now(),
      };

      if (this.versionControl && this.versionControl.items) {
        if (this.type?.value.toLowerCase() == 'feactures') {
          this.versionControl?.items?.feactures?.push(logItems);
        } else if (this.type?.value.toLowerCase() == 'bugs') {
          this.versionControl?.items?.bugs?.push(logItems);
        }
      }

      this._versionControlService.update(
        this.versionControl.key,
        this.versionControl
      );
      this._router.navigateByUrl('/version-control', { replaceUrl: true });
    }
  }

  /**
   *
   * If the itemtype has not been changed, the logitem is deleted.
   *
   * If the itemtype has been changed,
   * the previous item is deleted and inserted in the other itemType
   *
   */
  private _editLogItems(): void {
    const itemType: keyof logItemsI = this.type?.value.toLowerCase();
    const key: string | undefined = this.versionControl.key;

    if (this._type == itemType) {
      this.versionControl.items[itemType]?.forEach((item) => {
        if (item.timestamp == this._timestamp) {
          item.de = this.logitem?.value;
          item.en = this.logitem?.value;
        }
      });
    } else {
      // if the type habeens  changed
      let index = -1;
      const obj: languageI = {
        de: this.logitem?.value,
        en: this.logitem?.value,
        timestamp: 0,
      };
      this.versionControl.items[this._type]?.forEach((item, i) => {
        if (item.timestamp == this._timestamp) {
          index = i;
          obj.timestamp = item.timestamp;
          // del  from previous item
          this.versionControl?.items[this._type]?.splice(i, 1);
        }
      });
      this.versionControl.items[itemType]?.push(obj);
    }

    if (key) {
      this._versionControlService
        .update(key, this.versionControl)
        .then(() => {
          this._alertService.showToast(
            `Logitem für die Build version "${this.versionControl?.build.version}" wurde geändert.`,
            'middle',
            'success'
          );
          this._router.navigateByUrl(`/version-control-list`, {
            replaceUrl: true,
          });
        })
        .catch((error: any) => {
          console.error('error', error);
          this._alertService.showToast(
            'Logitem konnt nicht geändert werden.',
            'middle',
            'danger'
          );
        });
    }
  }

  /**
   *
   * get the AbstractControl  "type"
   *
   * @return  AbstractControl<any, any> | null
   *
   */
  protected get type(): AbstractControl<any, any> | null {
    return this.logItemsForm.get('type');
  }

  /**
   *
   * get the AbstractControl  "logitem"
   *
   * @return  AbstractControl<any, any> | null
   *
   */
  protected get logitem(): AbstractControl<any, any> | null {
    return this.logItemsForm.get('logitem');
  }

  /**
   *
   * create the form "logitem form"
   *
   * @returns FormGroup
   *
   */
  private _createLogItemsForm(): FormGroup {
    return this._fb.group({
      type: ['Feactures', [Validators.required]],
      logitem: ['', [Validators.required]],
    });
  }

  /**
   *
   * fetch the last version of logitems
   *
   */
  private _getVersionControlByLastVersion(): void {
    this._versionControlService
      .fetchByIsNotPublished()
      .subscribe((versionControl: VersionControlI[]) => {
        this.versionControl = versionControl[0];
      });
  }

  /**
   *
   * fetch the version control by ke
   *
   */
  private _getVersionControlByKey(): void {
    this._versionControlService
      .fetchByKey(this._key)
      .subscribe((versionControl: VersionControlI[]) => {
        this.versionControl = versionControl[0];
        if (
          versionControl[0] &&
          versionControl[0]?.items &&
          versionControl[0]?.items[this._type]
        ) {
          versionControl[0]?.items[this._type]?.forEach((item) => {
            if (item.timestamp == this._timestamp) {
              this.logitem?.setValue(item.de);
            }
          });
        }
      });
  }

  /**
   * Monitors the observable of the params and sets the appropriate form type
   *
   * fetches the queryParams "type", "timestamp" and "key" from the url, if available. These are required for edit.
   *
   * Rewrites the item types.
   *
   * With add fetch the last version of logitems
   * On edit fetches the VersionControl by its ID
   */
  private _initComponent() {
    // read param query buildVersion
    if (this._route.snapshot.queryParamMap.has('buildVersion')) {
      const query: string | null =
        this._route.snapshot.queryParamMap.get('buildVersion');
      if (query) {
        this._buildVersion = query;
      }
    } else if (this._route.snapshot.queryParamMap.has('type')) {
      const type: any = this._route.snapshot.queryParamMap.get('type');
      const timestamp: string | null =
        this._route.snapshot.queryParamMap.get('timestamp');
      const key: string | null = this._route.snapshot.queryParamMap.get('key');
      if (type) {
        this._type = type;
        let typeItem!: keyof logItemsI;
        if (type == 'feactures') {
          typeItem = 'Feactures';
        } else if (type == 'bugs') {
          typeItem = 'Bugs';
        }

        this.type?.setValue(typeItem);
      }
      if (timestamp) {
        this._timestamp = parseInt(timestamp);
      }
      if (key) {
        this._key = key;
      }
    }

    // set the form type (add or edit)
    this._route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('formtype')) {
        this.formtype = params.get('formtype') ?? '';
        if (params.get('formtype') == 'add') {
          this.headline = `Logitems hinzufügen build Version "${this._buildVersion}"`;
          this._getVersionControlByLastVersion();
        } else if (params.get('formtype') == 'edit') {
          this.headline = 'Logitems bearbeiten';
          this._getVersionControlByKey();
        }
      }
    });
  }
}
