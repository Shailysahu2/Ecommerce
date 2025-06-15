import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductFilter } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-1/4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4">Filters</h3>
            
            <!-- Search -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input type="text" 
                     placeholder="Search products..." 
                     class="form-input"
                     (input)="onSearchChange($event)">
            </div>

            <!-- Categories -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-800 mb-3">Categories</h4>
              @for (category of categories(); track category.id) {
                <label class="flex items-center mb-2">
                  <input type="checkbox" class="mr-2">
                  <span class="text-sm">{{ category.name }}</span>
                </label>
              }
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-800 mb-3">Price Range</h4>
              <div class="flex gap-2">
                <input type="number" placeholder="Min" class="form-input text-sm">
                <input type="number" placeholder="Max" class="form-input text-sm">
              </div>
            </div>

            <!-- Brands -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-800 mb-3">Brands</h4>
              @for (brand of brands(); track brand.id) {
                <label class="flex items-center mb-2">
                  <input type="checkbox" class="mr-2">
                  <span class="text-sm">{{ brand.name }}</span>
                </label>
              }
            </div>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="lg:w-3/4">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Products</h1>
            <select class="form-input w-auto">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
              <option>Rating</option>
            </select>
          </div>

          @if (isLoading()) {
            <div class="flex justify-center py-12">
              <div class="spinner"></div>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (product of products(); track product.id) {
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

          <!-- Pagination -->
          <div class="flex justify-center mt-8">
            <nav class="flex space-x-2">
              <button class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Previous</button>
              <button class="px-3 py-2 bg-blue-600 text-white rounded-md">1</button>
              <button class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
              <button class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">3</button>
              <button class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Next</button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<any[]>([]);
  brands = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadFilters();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (result) => {
        this.products.set(result.products);
        this.isLoading.set(false);
      }
    });
  }

  private loadFilters(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories)
    });

    this.productService.getBrands().subscribe({
      next: (brands) => this.brands.set(brands)
    });
  }

  onSearchChange(event: any): void {
    const query = event.target.value;
    if (query.length > 2) {
      this.productService.searchProducts(query).subscribe({
        next: (products) => this.products.set(products)
      });
    } else if (query.length === 0) {
      this.loadProducts();
    }
  }
}