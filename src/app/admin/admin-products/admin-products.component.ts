import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/admin/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  pages: number[] = [];

  newProduct = {
    productName: '',
    category: '',
    stock: 1,
    productDescription: '',
    productActualPrice: 1,
    productDiscountedPrice: 1
  };

  selectedProduct: any = null;
  updatedProduct: any = {};
  imageUrls: File[] = [];
  showSuccessToast = false;
  showFailureToast = false;

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data; // Initialize filtered list
      this.totalItems = this.filteredProducts.length;
      this.calculatePages();
      this.cdr.detectChanges();
    });
  }

  filterProducts(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.productName.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    this.totalItems = this.filteredProducts.length;
    this.currentPage = 1; // Reset to the first page after filtering
    this.calculatePages();
  }

  calculatePages(): void {
    const pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  get paginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.pages.length) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
    }
  }

  addProduct(): void {
    if (this.newProduct.stock <= 0) {
      alert('Stock cannot be zero or negative.');
      return;
    }
    if (!this.isPriceValid()) {
      alert('MRP Price must be greater than Discounted Price.');
      return;
    }

    const formData = new FormData();
    formData.append('product', JSON.stringify(this.newProduct));

    // Append image files to the FormData object
    this.imageUrls.forEach((image) => {
      formData.append('file', image, image.name);
    });

    this.productService.addProduct(formData).subscribe(
      () => {
        this.loadProducts();
        this.resetForm();
        this.showSuccessToast = true; // Show success toast when product is added
        setTimeout(() => (this.showSuccessToast = false), 3000); // Hide toast after 3 seconds
        alert('PRODUCT ADDED SUCCESSFUL')
      },
      (error) => {
        console.error('Error adding product:', error);
        alert('Failed to add the product. Please try again later.');
      }
    );
  }

  resetForm(): void {
    this.newProduct = {
      productName: '',
      category: '',
      stock: 0,
      productDescription: '',
      productDiscountedPrice: 0,
      productActualPrice: 0
    };
    this.imageUrls = [];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement; // Cast event target to HTMLInputElement
    if (input.files) {
      const files: File[] = Array.from(input.files); // Convert FileList to File[]
      this.imageUrls.push(...files);
      input.value = ''; // Clear input to allow re-selection
    }
  }

  isPriceValid(): boolean {
    return this.newProduct.productActualPrice > this.newProduct.productDiscountedPrice;
  }

  viewProduct(product: any): void {
    this.selectedProduct = product;
  }

  editProduct(product: any): void {
    console.log('Editing product:', product); // Log the entire product object
    this.selectedProduct = { ...product }; // Create a copy to avoid direct reference
    this.updatedProduct = { ...product }; // Bind product details to the form
    console.log('Updated Product:', this.updatedProduct); // Log the updatedProduct to check if the id is copied
  }

  // Method to save the updated product details
  saveUpdatedProduct(): void {
    console.log('Updated Product:', this.updatedProduct);

    if (this.updatedProduct.stock <= 0) {
      alert('Stock cannot be zero or negative.');
      return;
    }
    if (!this.isPriceValid()) {
      alert('MRP Price must be greater than Discounted Price.');
      return;
    }

    this.productService.updateProduct(this.updatedProduct).subscribe(
      (response) => {
        console.log('Product updated successfully:', response);
        this.loadProducts(); // Reload products after update
        this.resetForm();
        this.showSuccessToast = true;
        setTimeout(() => (this.showSuccessToast = false), 3000);
      },
      (error) => {
        console.error('Error updating product:', error);
        alert('Failed to update the product. Please try again later.');
      }
    );
  }


  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter((product) => product.id !== productId); // Remove deleted product from the list
          alert('Product deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete the product. Please try again later.');
        }
      });
    }
  }
}
