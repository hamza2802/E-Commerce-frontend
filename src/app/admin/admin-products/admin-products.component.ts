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
    stock: 0,
    productDescription: '',
    productDiscountedPrice: 0,
    productActualPrice: 0,
  };

  selectedProduct: any = null;
  updatedProduct: any = {};
  imageUrls: File[] = [];
  showSuccessToast = false;

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
    const formData = new FormData();

    // Serialize product data into JSON string
    formData.append('product', JSON.stringify(this.newProduct));

    // Append multiple image files
    Array.from(this.imageUrls).forEach((image) => {
      formData.append('file', image, image.name);
    });

    this.productService.addProduct(formData).subscribe(() => {
      this.loadProducts();
      this.resetForm();
    });

    this.showSuccessToast = true;
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

    // Call the updateProduct method from the service
    this.productService.updateProduct(this.updatedProduct).subscribe(
      (response) => {
        console.log('Product updated successfully:', response);
        // You can also update the products list after successful update
        this.loadProducts();
        this.resetForm(); // Reset form or perform any other action after saving
      },
      (error) => {
        console.error('Error updating product:', error);
        // Handle error appropriately, show an error message to the user
      }
    );
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          // Update the product list by removing the deleted product
          this.products = this.products.filter((product) => product.id !== productId);
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