import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <div class="spinner"></div>
        </div>
      } @else if (product()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Product Images -->
          <div class="space-y-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img [src]="product()!.images[0].url" 
                   [alt]="product()!.name"
                   class="w-full h-full object-cover">
            </div>
            <div class="grid grid-cols-4 gap-2">
              @for (image of product()!.images; track image.id) {
                <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75">
                  <img [src]="image.url" 
                       [alt]="image.alt"
                       class="w-full h-full object-cover">
                </div>
              }
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product()!.name }}</h1>
              <p class="text-gray-600">{{ product()!.shortDescription }}</p>
            </div>

            <!-- Rating -->
            <div class="flex items-center space-x-2">
              <div class="flex items-center">
                @for (star of [1,2,3,4,5]; track star) {
                  <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                }
              </div>
              <span class="text-gray-600">({{ product()!.ratings.count }} reviews)</span>
            </div>

            <!-- Price -->
            <div class="flex items-center space-x-4">
              @if (product()!.salePrice) {
                <span class="text-3xl font-bold text-red-600">\${{ product()!.salePrice }}</span>
                <span class="text-xl text-gray-500 line-through">\${{ product()!.price }}</span>
                <span class="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                  Save \${{ product()!.price - product()!.salePrice! }}
                </span>
              } @else {
                <span class="text-3xl font-bold text-gray-900">\${{ product()!.price }}</span>
              }
            </div>

            <!-- Stock Status -->
            <div class="flex items-center space-x-2">
              @if (product()!.inventory.status === 'in_stock') {
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-green-600 font-medium">In Stock</span>
              } @else {
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-red-600 font-medium">Out of Stock</span>
              }
            </div>

            <!-- Attributes -->
            @if (product()!.attributes.length > 0) {
              <div class="space-y-3">
                @for (attr of product()!.attributes; track attr.name) {
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-700">{{ attr.name }}:</span>
                    <span class="text-gray-600">{{ attr.value }}</span>
                  </div>
                }
              </div>
            }

            <!-- Actions -->
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <label class="font-medium text-gray-700">Quantity:</label>
                <select class="form-input w-20">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>

              <div class="flex space-x-4">
                <button class="flex-1 btn-primary py-3">Add to Cart</button>
                <button class="btn-secondary px-6 py-3">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Description -->
        <div class="mt-12">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button class="border-b-2 border-blue-500 py-2 px-1 text-blue-600 font-medium">Description</button>
              <button class="py-2 px-1 text-gray-500 hover:text-gray-700">Reviews</button>
              <button class="py-2 px-1 text-gray-500 hover:text-gray-700">Shipping</button>
            </nav>
          </div>
          <div class="py-6">
            <p class="text-gray-700 leading-relaxed">{{ product()!.description }}</p>
          </div>
        </div>

        <!-- Related Products -->
        @if (relatedProducts().length > 0) {
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (relatedProduct of relatedProducts(); track relatedProduct.id) {
                <div class="card p-4">
                  <img [src]="relatedProduct.images[0].url" 
                       [alt]="relatedProduct.name"
                       class="w-full h-32 object-cover rounded-lg mb-3">
                  <h3 class="font-medium text-gray-800 mb-1">{{ relatedProduct.name }}</h3>
                  <p class="text-blue-600 font-semibold">\${{ relatedProduct.salePrice || relatedProduct.price }}</p>
                </div>
              }
            </div>
          </div>
        }
      } @else {
        <div class="text-center py-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p class="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <a routerLink="/products" class="btn-primary">Browse Products</a>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(true);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
        
        if (product) {
          this.loadRelatedProducts(id);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private loadRelatedProducts(productId: string): void {
    this.productService.getRelatedProducts(productId).subscribe({
      next: (products) => {
        this.relatedProducts.set(products);
      }
    });
  }
}