import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div class="text-center py-12">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Checkout Coming Soon</h2>
        <p class="text-gray-600 mb-6">The checkout process is currently under development.</p>
        <a routerLink="/cart" class="btn-primary">Back to Cart</a>
      </div>
    </div>
  `
})
export class CheckoutComponent {}