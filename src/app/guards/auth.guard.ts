import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
class AuthGuard {
  CanActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const router = inject(Router);

    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expirationToken');

    if (token && expiration) {
      const expirationDate = new Date(expiration);
      const now = new Date();

      const nowUTC = new Date(Date.UTC(
        now.getFullYear(), now.getMonth(),
        now.getDate(), now.getHours(),
        now.getMinutes(), now.getSeconds())
      );

      if (expirationDate <= nowUTC) {
        console.log(`Data da API: ${expirationDate} | Data do Angular: ${nowUTC}`);
        this.resetLocalStorage();
        router.navigateByUrl('/login');
        return false;
      }

    } else {
      router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

  private resetLocalStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('expirationToken');
  }
}

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuard).CanActivate(route, state);
};
