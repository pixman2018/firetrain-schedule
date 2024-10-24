import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './authification/services/can-activate.guard';
import { PageoneComponent } from './example/angular/extends/pageone/pageone.component';
import { PagetwoComponent } from './example/angular/extends/pagetwo/pagetwo.component';
import { PagethreeComponent } from './example/angular/extends/pagethree/pagethree.component';
import { BaseComponent } from './example/angular/extends/base/base.component';
import { isAdminGuard } from './admin/services/isAdminGuard/is-admin.guard';

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
      canActivate: [CanActivateGuard],
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
      canActivate: [CanActivateGuard, isAdminGuard],
  },
  {
    path: 'training-form',
    loadChildren: () =>
      import('./pages/training/training-form/training-form.module').then(
        (m) => m.TrainingFormPageModule
      ),
      canActivate: [CanActivateGuard, isAdminGuard],
  },
  {
    path: 'training-edit/:key',
    loadChildren: () => import('./pages/training/training-form/training-form.module').then(
      (m) => m.TrainingFormPageModule
    ),
    canActivate: [CanActivateGuard, isAdminGuard],
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
      canActivate: [CanActivateGuard],
  },
  {
    path: 'workout-add',
    loadChildren: () =>
      import('./pages/workout/workout-form/workout-form.module').then(
        (m) => m.WorkoutFormPageModule
      ),
      canActivate: [CanActivateGuard],
  },
  {
    path: 'workout-edit/:key',
    loadChildren: () =>
      import('./pages/workout/workout-form/workout-form.module').then(
        (m) => m.WorkoutFormPageModule
      ),
      canActivate: [CanActivateGuard],
  },
  /*
    ****************************************
    training-in-workout
    ****************************************
  */
  {
    path: 'trainings-in-workout-list/:key',
    loadChildren: () =>
      import(
        './pages/trainingsInWorkout/trainings-in-workout-list/trainings-in-workout-list.module'
      ).then((m) => m.TrainingsInWorkoutListPageModule),
      canActivate: [ CanActivateGuard],
  },
  {
    path: 'training-in-workout-form/:key',
    loadChildren: () =>
      import(
        './pages/trainingsInWorkout/training-in-workout-form/training-in-workout-form.module'
      ).then((m) => m.TrainingInWorkoutFormPageModule),
      canActivate: [CanActivateGuard],
  },
  /*
    ****************************************
    Training start
    ****************************************
  */
  {
    path: 'training-start-list/:key',
    loadChildren: () =>
      import(
        './pages/training-start/training-start-list/training-start-list.module'
      ).then((m) => m.TrainingStartListPageModule),
      canActivate: [CanActivateGuard],
  },
  {
    path: 'training-start-analysis/:key',
    loadChildren: () =>
      import(
        './pages/training-start/training-start-analysis/training-start-analysis.module'
      ).then((m) => m.TrainingStartAnalysisPageModule),
      canActivate: [CanActivateGuard],
  },
  /*
    ****************************************
    App
    ****************************************
  */
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./pages/app/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyPageModule
      ),
      canActivate: [CanActivateGuard],
  },
  {
    path: 'imprint',
    loadChildren: () =>
      import('./pages/app/imprint/imprint.module').then(
        (m) => m.ImprintPageModule
      ),
      canActivate: [CanActivateGuard],
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/app/settings/settings.module').then( m => m.SettingsPageModule)
  },
  // {
  //   path: 'about',
  //   loadChildren: () =>
  //     import('./pages/app/about/about.module').then((m) => m.AboutPageModule),
  // },
  /*
    ****************************************
    admin
    ****************************************
  */
  {
    path: 'version-control',
    loadChildren: () => import('./admin/pages/version-control/version-control.module').then( m => m.VersionControlPageModule),
    canActivate: [CanActivateGuard, isAdminGuard],
  },
  {
    path: 'version-control-list',
    loadChildren: () => import('./admin/pages/version-control-list/version-control-list.module').then( m => m.versionControlistPageModule),
    canActivate: [CanActivateGuard, isAdminGuard],
  },
  {
    path: 'logitems-form/:formtype',
    loadChildren: () => import('./admin/pages/logitems-form/logitems-form.module').then( m => m.LogitemsFormPageModule),
    canActivate: [CanActivateGuard, isAdminGuard],
  },
  /*
    ****************************************
    example
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
  {
    path: 'base',
    component: BaseComponent,
  },
  {
    path: 'pageone',
    component: PageoneComponent,
  },
  {
    path: 'pagetwo',
    component: PagetwoComponent,
  },
  {
    path: 'pagethree',
    component: PagethreeComponent,
  },
  {
    path: 'datepicker',
    loadChildren: () => import('./example/angular/datepicker/datepicker.module').then( m => m.DatepickerPageModule),
  },
  {
    path: 'firebase',
    loadChildren: () => import('./example/firebase/firebase.module').then( m => m.FirebasePageModule),
  },
  {
    path: 'pargination',
    loadChildren: () => import('./example/firebase/pargination/pargination.module').then(m => m.ParginationPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
