import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';

// pipe
import { UcfirstPipe } from 'src/app/shared/pipes/ucFirst/ucfirst.pipe';
// data
import { CategoryArr } from 'src/app/shared/data/category';
// services
import { TrainingService } from 'src/app/shared/services/trainingService/training.service';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
// Interfaces
import { I_Data } from 'src/app/shared/interfaces/I_Data';
import { I_Training } from 'src/app/shared/interfaces/I_Training';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.page.html',
  styleUrls: ['./training-list.page.scss'],
})
export class TrainingListPage implements OnInit {
  protected selected = new FormControl('');
  // data
  protected categories: I_Data[] = CategoryArr;

  protected trainings: I_Training[] | [] = [];
  protected trainings$: Observable<I_Training[] | []> = of([]);

  private _trainingKey: string = '';
  private _trainingName: string = '';

  constructor(
    private readonly _router: Router,
    private readonly _trainingService: TrainingService,
    private readonly _alertService: AlertService
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  /**
   *
   * @private
   * @param filter
   * @param searchString
   * @param filterIds
   * @memberof TrainingListPage
   *
   * @description
   * fetch trainings all, filter, search or filter and search
   */
  private _fetchTrainings(
    filter: string | null = null,
    searchString: string = '',
    filterIds: string | null = null
  ): void {
    let request$: Observable<I_Training[]> | null = null;
    switch (filter) {
      case 'search':
        if (filterIds == null) {
          request$ = this._trainingService.search(searchString);
        } else {
          if (filterIds) {
            request$ = this._trainingService.filterAndSearch(
              filterIds,
              searchString
            );
          }
        }
        break;
      case 'filter':
        if (filterIds) {
          request$ = this._trainingService.filter(filterIds);
        }
        break;
      default:
        request$ = this._trainingService.fetchAll();
    }
    request$?.subscribe((trainings) => {
      console.log('trainings', trainings);
      this.trainings = trainings;
    });
  }

  /**
   *
   * @protected
   * @return  {(string | null)}
   * @memberof TrainingListPage
   *
   * @description
   * returns the selected filter
   *
   */
  protected get selectedCtrl(): string {
    let selected: string = '';
    if (this.selected.value) {
      selected = this.selected.value;
    }
    return selected;
  }

  /**
   *
   * @protected
   * @memberof TrainingListPage
   *
   * @description
   * fetch the training from filter
   *
   */
  protected onChangeFilter(): void {
    this._fetchTrainings('filter', '', this.selectedCtrl);
  }

  /**
   *
   * @protected
   * @memberof TrainingListPage
   * @param categoryIndex
   * @returns string
   * @description
   * get a category by index
   *
   */
  protected getCategory(categoryIndex: string): string {
    return this.categories[parseInt(categoryIndex)].de;
  }

  /**
   *
   * @protected
   * @memberof TrainingListPage
   *
   * @description
   * clear the selected control
   *
   */
  protected onCancelFilter(): void {
    this.selected.setValue('');
    this._fetchTrainings();
  }

  /**
   *
   * @protected
   * @memberof TrainingListPage
   *
   * @description
   * set the selected filter
   *
   */
  protected onSearch(event: any) {
    const ucFirst = new UcfirstPipe();
    const searchString = ucFirst.transform(event.target.value);
    if (searchString) {
      // if (searchString.length > 2) {
      this._fetchTrainings('search', searchString);
      // }
    } else {
      this._fetchTrainings();
    }
  }

  /**
   *
   * @protected
   * @param training
   * @memberof TrainingListPage
   *
   * @description
   * redirect to the training-edit
   *
   */
  protected onEdit(training: I_Training): void {
    this._router.navigateByUrl(`training-edit/${training.key}?isEdit=true`, {
      replaceUrl: true,
    });
  }

  /**
   *
   * @protected
   * @param training
   * @memberof TrainingListPage
   *
   * @description
   * Opens a confirm field
   * in which you must confirm whether the training is to be deleted
   *
   */
  protected onDelete(training: I_Training): void {
    if (training.key) {
      if (training.name) {
        this._trainingName = training.name;
      }
      if (training.key) {
        this._trainingKey = training.key;
      }
      this._alertService.showConfirm(
        'Workout löschen',
        `Möchtest du das Workout "${training.name}" wirklich löschen?`,
        'warning'
      );

      const workoutConfirm: Subscription = this._alertService
        .getConfirmResult()
        .subscribe((res) => {
          if (res) {
            workoutConfirm.unsubscribe();
            this._delTraining();
          }
        });
    }
  }
  /**
   *
   * @private
   * @returns FormGroup
   * @memberof TrainingListPage
   *
   * @description
   * delete the training and get a alert message
   *
   */
  private _delTraining() {
    this._trainingService
      .del(this._trainingKey)
      .then(() => {
        this._trainingKey = '';
        this._alertService.showToast(
          `Das Workout "${this._trainingName}" wurde gelöscht`
        );
      })
      .catch((error) => {
        console.error('Error', 'Workout konnte nicht gelöscht werden');
      });
  }

  /**
   *
   * @private
   * @returns FormGroup
   * @memberof TrainingListPage
   *
   * @description
   * fetch all trainings
   *
   */
  private _initComponent(): void {
    this._fetchTrainings();
  }
}
