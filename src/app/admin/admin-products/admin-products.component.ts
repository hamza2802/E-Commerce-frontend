import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/admin/product.service';
declare var bootstrap: any;

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
    productDiscountedPrice: 0
  };

  selectedProduct: any = null;
  updatedProduct: any = {};
  imageUrls: File[] = [];
  showSuccessToast = false;
  showFailureToast = false;

  selectedProductForImages: any = null; 
  csvFile: File | null = null; 
  csvPreview: string[] = [];
  
  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = [...data]; // Create a new array reference
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
    this.currentPage = 1;
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

   console.log('Adding product with data:', this.newProduct, this.imageUrls);
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

   console.log('Form data being sent:', formData);

   this.productService.addProduct(formData).subscribe(
     () => {
       this.loadProducts();
       this.resetForm();
       this.showSuccessToast = true; 
       setTimeout(() => (this.showSuccessToast = false), 3000); 
       alert('Product added successfully!');
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
    if (this.updatedProduct.productActualPrice && this.updatedProduct.productDiscountedPrice) {
      return this.updatedProduct.productActualPrice > this.updatedProduct.productDiscountedPrice;
    }
    return this.newProduct.productActualPrice > this.newProduct.productDiscountedPrice;
  }

  viewProduct(product: any): void {
    this.selectedProduct = product;
  }

  editProduct(product: any): void {
    this.selectedProduct = { ...product };
    this.updatedProduct = {
      productId: product.productId, // Ensure productId is included
      productName: product.productName,
      category: product.category,
      stock: product.stock,
      productDescription: product.productDescription,
      productActualPrice: product.productActualPrice,
      productDiscountedPrice: product.productDiscountedPrice,
      imageUrls: product.imageUrls
    };
  }

  // Method to save the updated product details
  saveUpdatedProduct(): void {
    if (!this.updatedProduct.productId) {
      console.error('Product ID is missing');
      return;
    }

    if (this.updatedProduct.stock <= 0) {
      alert('Stock cannot be zero or negative.');
      return;
    }
    
    if (!this.isPriceValid()) {
      alert('MRP Price must be greater than Discounted Price.');
      return;
    }

    this.productService.updateProduct(this.updatedProduct).subscribe({
      next: (response) => {
        // Update the products array with the updated product
        const index = this.products.findIndex(p => p.productId === this.updatedProduct.productId);
        if (index !== -1) {
          this.products[index] = { ...this.updatedProduct };
          this.filterProducts(); // Reapply any active filters
        }
        
        // Close the modal
        const modalElement = document.getElementById('editProductModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        
        // Show success message
        this.showSuccessToast = true;
        setTimeout(() => {
          this.showSuccessToast = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.showFailureToast = true;
        setTimeout(() => {
          this.showFailureToast = false;
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }


  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          // Update both products and filteredProducts arrays
          this.products = this.products.filter(product => product.productId !== productId);
          this.filteredProducts = this.filteredProducts.filter(product => product.productId !== productId);
          
          // Recalculate pagination
          this.totalItems = this.filteredProducts.length;
          this.calculatePages();
          
          // If current page is empty, go to previous page
          if (this.paginatedProducts.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
          
          this.cdr.detectChanges();
          
          // Show success message
          this.showSuccessToast = true;
          setTimeout(() => {
            this.showSuccessToast = false;
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.showFailureToast = true;
          setTimeout(() => {
            this.showFailureToast = false;
            this.cdr.detectChanges();
          }, 3000);
        }
      });
    }
  }

  setSelectedProductForImages(product: any): void { 
    console.log(this.selectedProductForImages);
    
    this.selectedProductForImages = product; 
    this.csvFile = null; 
    this.csvPreview = []; 
  } 
 
  onCsvFileSelected(event: Event): void { 
    const input = event.target as HTMLInputElement; 
    if (input.files && input.files[0]) { 
      this.csvFile = input.files[0]; 
      this.parseCsvFile(); 
    } 
  } 
 
  parseCsvFile(): void { 
    if (!this.csvFile) return; 
 
    const reader = new FileReader(); 
    reader.onload = (e: ProgressEvent<FileReader>): void => { 
      const text: string = (e.target?.result as string) || ''; 
      const lines: string[] = text.split('\n'); 
       
      // Assume first line is header 
      const header: string = lines[0].toLowerCase().trim(); 
      if (!header.includes('imageurl')) { 
        alert('CSV file must have a column named "imageUrl"'); 
        this.csvFile = null; 
        this.csvPreview = []; 
        return; 
      } 
 
      // Get URLs from CSV 
      this.csvPreview = lines 
        .slice(1) // Skip header 
        .map((line: string): string => line.trim()) 
        .filter((line: string): boolean => line.length > 0); 
    }; 
    reader.readAsText(this.csvFile); 
  } 
 
  uploadImagesFromCsv(): void { 
    if (!this.selectedProductForImages || !this.csvFile) return; 
    
    
   
    const formData = new FormData(); 
    formData.append('file', this.csvFile); 
   
    // Fix the parameter order: productId first, then formData 
    this.productService.uploadImagesFromCsv( 
      this.selectedProductForImages.productId,
      formData 
    ).subscribe({ 
      next: (response: any) => { 
        console.log(this.selectedProductForImages.productId);
        
        // Close modal 
        const modalElement = document.getElementById('csvUploadModal'); 
        if (modalElement) { 
          const modal = bootstrap.Modal.getInstance(modalElement); 
          modal?.hide(); 
        } 
   
        // Show success message 
        this.showSuccessToast = true; 
        setTimeout(() => { 
          this.showSuccessToast = false; 
          this.cdr.detectChanges(); 
        }, 3000); 
   
        // Reload product data 
        this.loadProducts(); 
      }, 
      error: (error: any) => { 
        console.error('Error uploading images:', error); 
        this.showFailureToast = true; 
        setTimeout(() => { 
          this.showFailureToast = false; 
          this.cdr.detectChanges(); 
        }, 3000); 
      } 
    }); 
  }

}
