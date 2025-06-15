import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-gray-300">404</h1>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="space-x-4">
          <a routerLink="/" class="btn-primary">Go Home</a>
          <button onclick="history.back()" class="btn-secondary">Go Back</button>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}