import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// service
import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
// interface
import { I_TrainingInWorkout } from 'src/app/shared/interfaces/I_TrainingInWorkout';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trainings-in-workout-list',
  templateUrl: './trainings-in-workout-list.page.html',
  styleUrls: ['./trainings-in-workout-list.page.scss'],
})
export class TrainingsInWorkoutListPage implements OnInit {
  protected workoutName: string = '';
  private _workoutKey: string = '-1';
  protected trainings: I_TrainingInWorkout[] = [];
  private _userId: string = window.sessionStorage.getItem('uid') ?? '-1';

  private _trainingKey: string = '';
  private _trainingName: string = '';

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _alertService: AlertService,
    private readonly _trainingInWorkoutService: TrainingInWorkoutService,
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  /**
   *
   * Go to the workout-list
   *
   */
  protected onToWorkout(): void {
    this._router.navigateByUrl(
      `workout-list`,
      {
        replaceUrl: true,
      }
    );
  }

  protected onEditTraining(training: I_TrainingInWorkout) {
    this._router.navigateByUrl(
      `training-in-workout-form/${this._workoutKey}?isEdit=1&trainingKey=${training.key}`,
      {
        replaceUrl: true,
      }
    );
  }

  protected onDelTraining(key: string, name: string): void {
    this._trainingKey = key;
    this._trainingName = name;
    this._alertService.showConfirm(
      'Training löschen',
      `Möchtest du das Training "${name}" wirklich löschen?`,
      'warning'
    );
    const trainingConfirm: Subscription = this._alertService.getConfirmResult()
    .subscribe(res => {
      if (res) {
        trainingConfirm.unsubscribe();
        this._delTraining();
      }
    });
  }

  private _delTraining() {
    this._trainingInWorkoutService.delTrainingInWorkout(this._workoutKey, this._trainingKey)
      .then(() => {
        this._alertService.showToast(
          `Training "${this._trainingName}" gelöscht.`,
          'top',
          'success'
        );
      })
      .catch((error) => {
        console.error('Error', 'Training konnte nicht gelöscht werden');
      });
  }

  protected onTrainingForm() {
    this._router.navigateByUrl(
      `training-in-workout-form/${this._workoutKey}?trainingsLenth=${this.trainings.length}`,
      {
        replaceUrl: true,
      }
    );
  }

  /**
   *
   * fetch all trainings from workout
   *
   */
  private _fetchTrainings(): void {
    this._trainingInWorkoutService
      .fetchAllTrainingInWorkout(this._workoutKey)
      .subscribe((training) => {
        this.trainings = training;
      });
  }



  private _initComponent(): void {
    /*
    ****************************************
    read the query params and params
    ****************************************
    */
    this.workoutName = this._route.snapshot.queryParams['workoutName'] ?? null;
    this._workoutKey = this._route.snapshot.paramMap.get('key') ?? '-1';

    /*
    ****************************************
    is userId exist
    ****************************************
    */
    if (!this._userId || this._userId == null) {
      this._router.navigateByUrl(`/'auth}`, {
        replaceUrl: true,
      });
    } else {
      this._fetchTrainings();
    }
  }
}
