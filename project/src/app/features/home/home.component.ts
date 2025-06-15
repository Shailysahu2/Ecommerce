import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product, Category } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-5xl md:text-6xl font-bold mb-6 fade-in">
              Welcome to EcomStore
            </h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90 fade-in">
              Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, secure delivery.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center fade-in">
              <a routerLink="/products" class="btn-primary text-lg px-8 py-4">
                Shop Now
              </a>
              <a routerLink="/products?featured=true" class="btn-secondary text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100">
                View Deals
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6 card">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Free Shipping</h3>
              <p class="text-gray-600">Free shipping on orders over $50. Fast and reliable delivery to your doorstep.</p>
            </div>

            <div class="text-center p-6 card">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p class="text-gray-600">100% authentic products with quality guarantee. Shop with complete confidence.</p>
            </div>

            <div class="text-center p-6 card">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">24/7 Support</h3>
              <p class="text-gray-600">Round-the-clock customer support. We're here to help whenever you need us.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for.
            </p>
          </div>

          @if (isLoading()) {
            <div class="flex justify-center">
              <div class="spinner"></div>
            </div>
          } @else {
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              @for (category of categories(); track category.id) {
                <a routerLink="/products" [queryParams]="{category: category.slug}" 
                   class="group text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span class="text-white font-bold text-lg">{{ category.name[0] }}</span>
                  </div>
                  <h3 class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {{ category.name }}
                  </h3>
                </a>
              }
            </div>
          }
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Check out our handpicked selection of the best products just for you.
            </p>
          </div>

          @if (isLoading()) {
            <div class="flex justify-center">
              <div class="spinner"></div>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (product of featuredProducts(); track product.id) {
                <div class="card p-4 group">
                  <div class="relative mb-4 overflow-hidden rounded-lg">
                    <img [src]="product.images[0].url" 
                         [alt]="product.name"
                         class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
                    @if (product.salePrice) {
                      <div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        Sale
                      </div>
                    }
                  </div>
                  
                  <h3 class="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {{ product.name }}
                  </h3>
                  
                  <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                    {{ product.shortDescription }}
                  </p>
                  
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      @if (product.salePrice) {
                        <span class="text-lg font-bold text-red-600">\${{ product.salePrice }}</span>
                        <span class="text-sm text-gray-500 line-through">\${{ product.price }}</span>
                      } @else {
                        <span class="text-lg font-bold text-gray-800">\${{ product.price }}</span>
                      }
                    </div>
                    
                    <div class="flex items-center space-x-1">
                      <svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span class="text-sm text-gray-600">{{ product.ratings.average }}</span>
                    </div>
                  </div>
                  
                  <div class="flex space-x-2">
                    <a [routerLink]="['/products', product.id]" class="flex-1 btn-primary text-center text-sm py-2">
                      View Details
                    </a>
                    <button class="btn-secondary px-3 py-2">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          }

          <div class="text-center mt-12">
            <a routerLink="/products" class="btn-primary text-lg px-8 py-3">
              View All Products
            </a>
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="py-16 bg-gray-900 text-white">
        <div class="container mx-auto px-4">
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
            <p class="text-gray-300 mb-8">
              Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special offers.
            </p>
            
            <form class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" 
                     placeholder="Enter your email" 
                     class="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <button type="submit" class="btn-primary px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  categories = signal<Category[]>([]);
  featuredProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(true);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);

    // Load categories
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      }
    });

    // Load featured products
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts.set(products);
        this.isLoading.set(false);
      }
    });
  }
}