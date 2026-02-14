import { Routes } from '@angular/router';
import { authGuard } from './pages/auth/services/auth-guard/auth-guard';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
        canActivate: [authGuard],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
        canActivate: [authGuard],
      },
      {
        path: '',
        redirectTo: 'tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'training-form',
    loadComponent: () =>
      import('./pages/trainings/training-form/training-form.page').then(
        (m) => m.TrainingFormPage,
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
    // loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'trainings-list',
    loadComponent: () => import('./pages/trainings/trainings-list/trainings-list.page').then( m => m.TrainingsListPage)
  },
];
