import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
class AuthGuard {
  CanActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const router = inject(Router);

    const token = localStorage.getItem('token');

    const DateNowUTC = new Date(new Date().toISOString());
    const expirationDate = this.formatDate(localStorage.getItem('expirationToken'));

    if (!token || expirationDate <= DateNowUTC) {
      this.resetLocalStorage();
      router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

  private formatDate(date: any): Date {
    if (date) {
      const [dia, mes, ano, horas, minutos, segundos] = date.split(/[\s:/]/).map(Number);

      return new Date(Date.UTC(ano, mes - 1, dia, horas, minutos, segundos));
    }

    return new Date(new Date().toISOString());
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
