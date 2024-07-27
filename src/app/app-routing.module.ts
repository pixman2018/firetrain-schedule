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
    loadChildren: () => import('./authification/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  /*
    ****************************************
    Training
    ****************************************
  */
    {
      path: 'training-list',
      loadChildren: () => import('./pages/training/training-list/training-list.module').then( m => m.TrainingListPageModule)
    },
    {
      path: 'training-form',
      loadChildren: () => import('./pages/training/training-form/training-form.module').then( m => m.TrainingFormPageModule)
    },
    /*
    ****************************************
    Workout
    ****************************************
  */
    {
      path: 'workout-list',
      loadChildren: () => import('./pages/workout/workout-list/workout-list.module').then( m => m.WorkoutListPageModule)
    },
  {
    path: 'workout-form',
    loadChildren: () => import('./pages/workout/workout-form/workout-form.module').then( m => m.WorkoutFormPageModule)
  },
   /*
    ****************************************
    Example
    ****************************************
  */
  {
    path: 'example',
    loadChildren: () => import('./example/ionic/home/home.module').then( m => m.HomePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
