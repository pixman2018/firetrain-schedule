import { Injectable, isDevMode } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class isAdminGuard implements CanActivate {
  constructor(
    private readonly _router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isAdmin = window.sessionStorage.getItem('isAdmin');
    if (isAdmin && isDevMode()) {
      return true;
    } else {
      this._router.navigate(['workout-list']);
      return false;
    }
  }
}
