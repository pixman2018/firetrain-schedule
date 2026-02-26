import { Component, effect, enableProdMode, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './pages/auth/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  constructor() {
    // console.log('pro', enableProdMode());

    effect(() => {
      const user = this._authService.currentUser();

      if (user === null) {
        console.log('No login, redirect to login');
        this._router.navigateByUrl('/login');
      } else {
        if (this._router.url === '/login') {
          this._router.navigateByUrl('/home');
        }
      }
    });
  }
}
