import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Employee Dashboard</h1>
      
      <div class="text-center py-12">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Employee Dashboard Coming Soon</h2>
        <p class="text-gray-600 mb-6">The employee dashboard is currently under development.</p>
        <a routerLink="/" class="btn-primary">Go Home</a>
      </div>
    </div>
  `
})
export class EmployeeDashboardComponent {}