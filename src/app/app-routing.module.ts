import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './authification/services/can-activate.guard';
import { PageoneComponent } from './example/angular/extends/pageone/pageone.component';
import { PagetwoComponent } from './example/angular/extends/pagetwo/pagetwo.component';
import { PagethreeComponent } from './example/angular/extends/pagethree/pagethree.component';
import { BaseComponent } from './example/angular/extends/base/base.component';

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
      path: 'training-start-list/:key',
      loadChildren: () => import('./pages/training-start/training-start-list/training-start-list.module').then( m => m.TrainingStartListPageModule)
    },
  {
    path: 'training-start-analysis/:key',
    loadChildren: () => import('./pages/training-start/training-start-analysis/training-start-analysis.module').then( m => m.TrainingStartAnalysisPageModule)
  },
    /*
    ****************************************
    App
    ****************************************
  */
  {
    path: 'privacy-policy',
    loadChildren: () => import('./pages/app/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'imprint',
    loadChildren: () => import('./pages/app/imprint/imprint.module').then( m => m.ImprintPageModule)
  },

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
  {
    path: 'base', component: BaseComponent,
  },
  {
    path: 'pageone', component: PageoneComponent,
  },
  {
    path: 'pagetwo', component: PagetwoComponent,
  },
  {
    path: 'pagethree', component: PagethreeComponent,
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
