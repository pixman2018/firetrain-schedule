import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// service
import { WorkoutService } from 'src/app/shared/services/workoutService/workout.service';
// interface
import { I_Workout } from 'src/app/shared/interfaces/I_Workout';
import { TrainingInWorkoutService } from 'src/app/shared/services/trainingInWorkout/training-in-workout.service';
import { I_TrainingInWorkout } from 'src/app/shared/interfaces/I_TrainingInWorkout';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { IonAccordionGroup } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.page.html',
  styleUrls: ['./workout-list.page.scss'],
})
export class WorkoutListPage implements OnInit {
  @ViewChild('accordionGroup', { static: true })
  accordionGroup!: IonAccordionGroup;

  protected workouts: I_Workout[] | undefined;
  private _workoutKey: string = '';
  private _workoutName: string = '';
  private _isDelWorkout: boolean = false; // Was delete workout pressed

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _workoutService: WorkoutService,
    private readonly _alertService: AlertService
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  private _fetchAllWorkout() {
    this._workoutService.fetchAll().subscribe((workout) => {
      this.workouts = workout;
    });
  }

  protected onInsertTraining(workout: I_Workout) {
    this._router.navigateByUrl(`training-in-workout-form/${workout.key}`, {
      replaceUrl: true,
    });
  }

  protected onEdit(workout: I_Workout) {
    this._router.navigateByUrl(`workout-edit/${workout.key}?isEdit=true`, {
      replaceUrl: true,
    });
  }

  protected onDeleteWorkout(workout: I_Workout) {
    if (workout.key) {
      this._workoutKey = workout.key;
      this._workoutName = workout.name;
      this._isDelWorkout = true;
      this._alertService.showConfirm(
        'Workout löschen',
        `Möchtest du das Workout "${workout.name}" wirklich löschen?`,
        'warning'
      );

      const workoutConfirm: Subscription = this._alertService.getConfirmResult()
        .subscribe((res) => {
          console.log(res)
          if (res) {
            workoutConfirm.unsubscribe();
            this._delWorkout();
          }
      });
    }
  }

  private _delWorkout() {
    this._workoutService.del(this._workoutKey).then(() => {
      this._workoutKey = '';
      this._alertService.showToast(
        `Das Workout "${this._workoutName}" wurde gelöscht`
      );
    })
    .catch((error) => {
      console.error('Error', 'Workout konnte nicht gelöscht werden');
    });
  }

  /**
   *
   * redirects to the Componete workout form to insert a new workout in the database
   *
   */
  protected onGoToAdd(): void {
    this._router.navigateByUrl('/workout-add', { replaceUrl: true });
  }

  private _openCurrentAccorion() {
    const nativeEl = this.accordionGroup;
    const currentAccordion =
      this._route.snapshot.queryParamMap.get('accordion');
    if (nativeEl.value === currentAccordion) {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = currentAccordion;
    }
  }

  private _initComponent(): void {
    this._fetchAllWorkout();
    if (this._isDelWorkout) {
    //   const workoutConfirm: Subscription = this._alertService.getConfirmResult()
    //   .subscribe((res) => {
    //     console.log(res)
    //     if (res) {
    //       workoutConfirm.unsubscribe();
    //       this._isDelWorkout = false;
    //       this._delWorkout();
    //     }
    // });
    }

    if (this._route.snapshot.queryParamMap.has('accordion')) {
      // open the current accorion
      this._openCurrentAccorion();
    }
  }
}
