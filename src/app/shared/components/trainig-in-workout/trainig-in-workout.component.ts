import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// service
import { TrainingInWorkoutService } from '../../services/trainingInWorkout/training-in-workout.service';
// interface
import { TrainingInWorkoutI } from '../../interfaces/TrainingInWorkoutI';
import { AlertService } from '../../services/alert/alert.service';
import { first, Subscription } from 'rxjs';

@Component({
  selector: 'app-trainig-in-workout',
  templateUrl: './trainig-in-workout.component.html',
  styleUrls: ['./trainig-in-workout.component.scss'],
})
export class TrainigInWorkoutComponent  implements OnInit {

  @Input() workoutKey: string | undefined;
  @Input() countAccordion: number = 0;

  private _trainingKey: string = '';
  private _trainingName: string = '';

  private _ussrId: string | null = null;
  protected trainings: TrainingInWorkoutI[] = []

  constructor(
    private readonly _router: Router,
    private readonly _alertService: AlertService,
    private readonly _trainingInWorkoutService: TrainingInWorkoutService,
  ) { }

  ngOnInit() {
    this._initComponent();
  }

  protected onEditTraining(training: TrainingInWorkoutI){
    this._router.navigateByUrl(`/training-in-workout-form/${this.workoutKey}?isEdit=true&trainingKey=${training.key}&url=workoutList&index=${this.countAccordion}`, {
      replaceUrl: true,
    });
  }

  protected onDeleteTraining(training: TrainingInWorkoutI) {
    if (training.key) {
      this._trainingKey = training.key;
      this._trainingName = training.name;
      this._alertService.showConfirm(
        'Workout löschen',
        `Möchtest du das Training "${training.name}" wirklich löschen?`,
        'warning'
      );
    }

    const trainingConfirm: Subscription = this._alertService.getConfirmResult()
        .subscribe((res) => {
          console.log('res', res)
        if (res) {
          this._delTraining();
          trainingConfirm.unsubscribe();
        }
      });
  }

  private _delTraining() {
    if (this.workoutKey &&  this._trainingKey) {
      this._trainingInWorkoutService.delTrainingInWorkout(this.workoutKey, this._trainingKey).then(() => {
        this.workoutKey = '';
        this._alertService.showToast(
          `Das Training "${this._trainingName}" wurde gelöscht`
        );
      })
      .catch(error => {
        console.error('ERROR, Training konnte nicht gelöscht werden.', error)
      });
    }
  }


  private getTrainingsByWorkoutKey() {
    if (this.workoutKey) {
      this._trainingInWorkoutService.fetchAllTrainingInWorkout(this.workoutKey)
        .subscribe((training) => {
          this.trainings = training;
        })
    }
  }

  private _initComponent(): void {
    this._ussrId = sessionStorage.getItem('uid');
    if (!this._ussrId) {
      this._router.navigateByUrl(`/auth}`, {
        replaceUrl: true,
      });
    } else {
      this.getTrainingsByWorkoutKey();
    }


  }

}
