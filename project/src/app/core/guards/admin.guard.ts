import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && 
        this.authService.hasAnyRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}