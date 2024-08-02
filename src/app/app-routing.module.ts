import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './authification/services/can-activate.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [CanActivateGuard],
  },
  /*
  ****************************************
  Auth
  ****************************************
  */
  {
    path: 'auth',
    loadChildren: () =>
      import('./authification/auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./authification/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
  },
  /*
    ****************************************
    Training
    ****************************************
  */
  {
    path: 'training-list',
    loadChildren: () =>
      import('./pages/training/training-list/training-list.module').then(
        (m) => m.TrainingListPageModule
      ),
  },
  {
    path: 'training-form',
    loadChildren: () =>
      import('./pages/training/training-form/training-form.module').then(
        (m) => m.TrainingFormPageModule
      ),
  },
  /*
    ****************************************
    Workout
    ****************************************
  */
  {
    path: 'workout-list',
    loadChildren: () =>
      import('./pages/workout/workout-list/workout-list.module').then(
        (m) => m.WorkoutListPageModule
      ),
  },
  {
    path: 'workout-add',
    loadChildren: () =>
      import('./pages/workout/workout-form/workout-form.module').then(
        (m) => m.WorkoutFormPageModule
      ),
  },
  {
    path: 'workout-edit/:key',
    loadChildren: () =>
      import('./pages/workout/workout-form/workout-form.module').then(
        (m) => m.WorkoutFormPageModule
      ),
  },
  /*
    ****************************************
    training-in-workou
    ****************************************
  */
  {
    path: 'trainings-in-workout-list/:key',
    loadChildren: () =>
      import(
        './pages/trainingsInWorkout/trainings-in-workout-list/trainings-in-workout-list.module'
      ).then((m) => m.TrainingsInWorkoutListPageModule),
  },
  {
    path: 'training-in-workout-form/:key',
    loadChildren: () =>
      import(
        './pages/trainingsInWorkout/training-in-workout-form/training-in-workout-form.module'
      ).then((m) => m.TrainingInWorkoutFormPageModule),
  },
    /*
    ****************************************
    Training start
    ****************************************
  */
    {
      path: 'training-start-list',
      loadChildren: () => import('./pages/training-start/training-start-list/training-start-list.module').then( m => m.TrainingStartListPageModule)
    },
  {
    path: 'training-start-add',
    loadChildren: () => import('./pages/training-start/training-start-add/training-start-add.module').then( m => m.TrainingStartAddPageModule)
  },
  {
    path: 'training-start-analysis',
    loadChildren: () => import('./pages/training-start/training-start-analysis/training-start-analysis.module').then( m => m.TrainingStartAnalysisPageModule)
  },
  /*
    ****************************************
    Example
    ****************************************
  */
  {
    path: 'example',
    loadChildren: () =>
      import('./example/ionic/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'style-guide',
    loadChildren: () =>
      import('./example/style-guide/style-guide.module').then(
        (m) => m.StyleGuidePageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
