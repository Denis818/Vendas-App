import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
class AuthGuard {
  CanActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const router = inject(Router);
    const token = localStorage.getItem('token');
    if (!token) {

      router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuard).CanActivate(route, state);
};
