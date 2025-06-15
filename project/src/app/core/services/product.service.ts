import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import { Product, ProductFilter, Category, Brand } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:3000/api/products';
  
  // Signals for reactive state
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadMockData();
  }

  private loadMockData(): void {
    // Mock categories
    const mockCategories: Category[] = [
      { id: '1', name: 'Electronics', slug: 'electronics', isActive: true },
      { id: '2', name: 'Clothing', slug: 'clothing', isActive: true },
      { id: '3', name: 'Home & Garden', slug: 'home-garden', isActive: true },
      { id: '4', name: 'Sports', slug: 'sports', isActive: true },
      { id: '5', name: 'Books', slug: 'books', isActive: true }
    ];

    // Mock brands
    const mockBrands: Brand[] = [
      { id: '1', name: 'Apple', slug: 'apple', isActive: true },
      { id: '2', name: 'Samsung', slug: 'samsung', isActive: true },
      { id: '3', name: 'Nike', slug: 'nike', isActive: true },
      { id: '4', name: 'Adidas', slug: 'adidas', isActive: true },
      { id: '5', name: 'Sony', slug: 'sony', isActive: true }
    ];

    // Mock products
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'iPhone 15 Pro',
        description: 'The latest iPhone with advanced features and stunning design.',
        shortDescription: 'Latest iPhone with Pro features',
        sku: 'IPH15PRO001',
        price: 999,
        salePrice: 899,
        images: [
          { id: '1', url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', alt: 'iPhone 15 Pro', isPrimary: true, order: 1 }
        ],
        category: mockCategories[0],
        brand: mockBrands[0],
        tags: ['smartphone', 'apple', 'premium'],
        attributes: [
          { name: 'Storage', value: '256GB', type: 'select' },
          { name: 'Color', value: 'Space Black', type: 'select' }
        ],
        variants: [],
        inventory: { quantity: 50, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, status: 'in_stock' },
        seo: { slug: 'iphone-15-pro', title: 'iPhone 15 Pro - Latest Apple Smartphone' },
        ratings: { average: 4.8, count: 245, distribution: { 5: 180, 4: 45, 3: 15, 2: 3, 1: 2 } },
        reviews: [],
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Samsung Galaxy S24',
        description: 'Powerful Android smartphone with excellent camera and performance.',
        shortDescription: 'Latest Samsung Galaxy flagship',
        sku: 'SGS24001',
        price: 849,
        images: [
          { id: '2', url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg', alt: 'Samsung Galaxy S24', isPrimary: true, order: 1 }
        ],
        category: mockCategories[0],
        brand: mockBrands[1],
        tags: ['smartphone', 'samsung', 'android'],
        attributes: [
          { name: 'Storage', value: '128GB', type: 'select' },
          { name: 'Color', value: 'Phantom Black', type: 'select' }
        ],
        variants: [],
        inventory: { quantity: 35, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, status: 'in_stock' },
        seo: { slug: 'samsung-galaxy-s24', title: 'Samsung Galaxy S24 - Android Flagship' },
        ratings: { average: 4.6, count: 189, distribution: { 5: 120, 4: 45, 3: 18, 2: 4, 1: 2 } },
        reviews: [],
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with excellent cushioning and style.',
        shortDescription: 'Premium running shoes',
        sku: 'NAM270001',
        price: 150,
        salePrice: 120,
        images: [
          { id: '3', url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', alt: 'Nike Air Max 270', isPrimary: true, order: 1 }
        ],
        category: mockCategories[3],
        brand: mockBrands[2],
        tags: ['shoes', 'running', 'nike'],
        attributes: [
          { name: 'Size', value: '10', type: 'select' },
          { name: 'Color', value: 'Black/White', type: 'select' }
        ],
        variants: [],
        inventory: { quantity: 75, lowStockThreshold: 15, trackQuantity: true, allowBackorder: false, status: 'in_stock' },
        seo: { slug: 'nike-air-max-270', title: 'Nike Air Max 270 - Running Shoes' },
        ratings: { average: 4.7, count: 156, distribution: { 5: 98, 4: 38, 3: 15, 2: 3, 1: 2 } },
        reviews: [],
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-canceling wireless headphones with exceptional sound quality.',
        shortDescription: 'Noise-canceling headphones',
        sku: 'SWH1000XM5',
        price: 399,
        images: [
          { id: '4', url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', alt: 'Sony WH-1000XM5', isPrimary: true, order: 1 }
        ],
        category: mockCategories[0],
        brand: mockBrands[4],
        tags: ['headphones', 'wireless', 'noise-canceling'],
        attributes: [
          { name: 'Color', value: 'Black', type: 'select' },
          { name: 'Connectivity', value: 'Bluetooth 5.2', type: 'text' }
        ],
        variants: [],
        inventory: { quantity: 25, lowStockThreshold: 5, trackQuantity: true, allowBackorder: false, status: 'in_stock' },
        seo: { slug: 'sony-wh-1000xm5', title: 'Sony WH-1000XM5 - Premium Headphones' },
        ratings: { average: 4.9, count: 312, distribution: { 5: 280, 4: 25, 3: 5, 2: 1, 1: 1 } },
        reviews: [],
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.categories.set(mockCategories);
    this.brands.set(mockBrands);
    this.products.set(mockProducts);
  }

  getProducts(filter?: ProductFilter): Observable<{ products: Product[], total: number }> {
    this.isLoading.set(true);
    
    return of({ products: this.products(), total: this.products().length })
      .pipe(
        delay(500),
        map(result => {
          this.isLoading.set(false);
          return result;
        })
      );
  }

  getProduct(id: string): Observable<Product | null> {
    const product = this.products().find(p => p.id === id);
    return of(product || null).pipe(delay(300));
  }

  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.products().filter(p => p.isFeatured);
    return of(featured).pipe(delay(300));
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories()).pipe(delay(200));
  }

  getBrands(): Observable<Brand[]> {
    return of(this.brands()).pipe(delay(200));
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = this.products().filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filtered).pipe(delay(300));
  }

  getRelatedProducts(productId: string): Observable<Product[]> {
    const product = this.products().find(p => p.id === productId);
    if (!product) return of([]);

    const related = this.products()
      .filter(p => p.id !== productId && p.category.id === product.category.id)
      .slice(0, 4);
    
    return of(related).pipe(delay(300));
  }

  // Admin methods
  createProduct(product: Partial<Product>): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as Product;

    const currentProducts = this.products();
    this.products.set([...currentProducts, newProduct]);
    
    return of(newProduct).pipe(delay(500));
  }

  updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    const currentProducts = this.products();
    const index = currentProducts.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct = {
      ...currentProducts[index],
      ...updates,
      updatedAt: new Date()
    };

    currentProducts[index] = updatedProduct;
    this.products.set([...currentProducts]);
    
    return of(updatedProduct).pipe(delay(500));
  }

  deleteProduct(id: string): Observable<boolean> {
    const currentProducts = this.products();
    const filtered = currentProducts.filter(p => p.id !== id);
    this.products.set(filtered);
    
    return of(true).pipe(delay(500));
  }
}