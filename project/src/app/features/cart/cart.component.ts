import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      @if (cartItems().length === 0) {
        <div class="text-center py-12">
          <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
          </svg>
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p class="text-gray-600 mb-6">Start shopping to add items to your cart.</p>
          <a routerLink="/products" class="btn-primary">Continue Shopping</a>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2 space-y-4">
            @for (item of cartItems(); track item.id) {
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center space-x-4">
                  <img [src]="item.image" 
                       [alt]="item.name"
                       class="w-20 h-20 object-cover rounded-lg">
                  
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
                    <p class="text-gray-600 text-sm">{{ item.description }}</p>
                    <p class="text-blue-600 font-semibold mt-1">\${{ item.price }}</p>
                  </div>

                  <div class="flex items-center space-x-3">
                    <button (click)="updateQuantity(item.id, item.quantity - 1)" 
                            class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    
                    <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                    
                    <button (click)="updateQuantity(item.id, item.quantity + 1)"
                            class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </button>
                  </div>

                  <div class="text-right">
                    <p class="font-semibold text-gray-900">\${{ item.price * item.quantity }}</p>
                    <button (click)="removeItem(item.id)" 
                            class="text-red-600 hover:text-red-800 text-sm mt-1">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Order Summary -->
          <div class="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">\${{ subtotal() }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">\${{ shipping() }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span class="font-medium">\${{ tax() }}</span>
              </div>
              
              <hr class="my-4">
              
              <div class="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>\${{ total() }}</span>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <button class="w-full btn-primary py-3">Proceed to Checkout</button>
              <a routerLink="/products" class="block text-center text-blue-600 hover:text-blue-800">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CartComponent {
  cartItems = signal([
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with Pro features',
      price: 999,
      quantity: 1,
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      description: 'Latest Samsung Galaxy flagship',
      price: 849,
      quantity: 2,
      image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'
    }
  ]);

  subtotal = signal(0);
  shipping = signal(10);
  tax = signal(0);
  total = signal(0);

  constructor() {
    this.calculateTotals();
  }

  updateQuantity(itemId: string, newQuantity: number): void {
    if (newQuantity < 1) return;
    
    this.cartItems.update(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    this.calculateTotals();
  }

  removeItem(itemId: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== itemId));
    this.calculateTotals();
  }

  private calculateTotals(): void {
    const subtotal = this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    
    this.subtotal.set(subtotal);
    this.tax.set(Math.round(tax * 100) / 100);
    this.shipping.set(shipping);
    this.total.set(Math.round((subtotal + tax + shipping) * 100) / 100);
  }
}