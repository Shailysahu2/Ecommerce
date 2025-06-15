import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">E</span>
              </div>
              <span class="text-xl font-bold text-gray-800">EcomStore</span>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <a routerLink="/" routerLinkActive="text-blue-600" [routerLinkActiveOptions]="{exact: true}" 
               class="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
            <a routerLink="/products" routerLinkActive="text-blue-600" 
               class="text-gray-700 hover:text-blue-600 transition-colors">Products</a>
            <a routerLink="/support" routerLinkActive="text-blue-600" 
               class="text-gray-700 hover:text-blue-600 transition-colors">Support</a>
          </nav>

          <!-- Search Bar -->
          <div class="hidden lg:flex flex-1 max-w-md mx-8">
            <div class="relative w-full">
              <input type="text" 
                     placeholder="Search products..." 
                     class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- User Actions -->
          <div class="flex items-center space-x-4">
            <!-- Cart -->
            <a routerLink="/cart" class="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
              </svg>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ cartItemCount() }}
              </span>
            </a>

            <!-- User Menu -->
            @if (isAuthenticated()) {
              <div class="relative" (click)="toggleUserMenu()">
                <button class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ userInitials() }}</span>
                  </div>
                  <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                @if (showUserMenu()) {
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <a routerLink="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                    <a routerLink="/profile/orders" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Orders</a>
                    
                    @if (isAdmin()) {
                      <hr class="my-2">
                      <a routerLink="/admin" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Admin Dashboard</a>
                    }
                    
                    @if (isEmployee()) {
                      <hr class="my-2">
                      <a routerLink="/employee" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Employee Panel</a>
                    }
                    
                    <hr class="my-2">
                    <button (click)="logout()" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                }
              </div>
            } @else {
              <div class="flex items-center space-x-2">
                <a routerLink="/auth/login" class="btn-secondary">Login</a>
                <a routerLink="/auth/register" class="btn-primary">Sign Up</a>
              </div>
            }

            <!-- Mobile Menu Button -->
            <button class="md:hidden p-2 text-gray-700 hover:text-blue-600" (click)="toggleMobileMenu()">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        @if (showMobileMenu()) {
          <div class="md:hidden border-t border-gray-200 py-4">
            <div class="flex flex-col space-y-4">
              <a routerLink="/" class="text-gray-700 hover:text-blue-600">Home</a>
              <a routerLink="/products" class="text-gray-700 hover:text-blue-600">Products</a>
              <a routerLink="/support" class="text-gray-700 hover:text-blue-600">Support</a>
              
              @if (!isAuthenticated()) {
                <div class="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <a routerLink="/auth/login" class="btn-secondary text-center">Login</a>
                  <a routerLink="/auth/register" class="btn-primary text-center">Sign Up</a>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </header>
  `
})
export class HeaderComponent {
  showUserMenu = signal(false);
  showMobileMenu = signal(false);
  cartItemCount = signal(0);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isAuthenticated = computed(() => this.authService.isAuthenticated());
  currentUser = computed(() => this.authService.currentUser());
  
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  });

  isAdmin = computed(() => {
    const user = this.currentUser();
    return user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  });

  isEmployee = computed(() => {
    const user = this.currentUser();
    return user?.role === UserRole.EMPLOYEE || user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  });

  toggleUserMenu(): void {
    this.showUserMenu.update(show => !show);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.update(show => !show);
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu.set(false);
  }
}