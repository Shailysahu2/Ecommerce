import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  isEditing = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  onEdit(product: Product): void {
    this.selectedProduct = { ...product };
    this.isEditing = true;
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  onSave(product: Product): void {
    if (product._id) {
      this.productService.updateProduct(product._id, product).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p._id === product._id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          this.isEditing = false;
          this.selectedProduct = null;
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    } else {
      this.productService.createProduct(product).subscribe({
        next: (newProduct) => {
          this.products.push(newProduct);
          this.isEditing = false;
          this.selectedProduct = null;
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.isEditing = false;
    this.selectedProduct = null;
  }
} 