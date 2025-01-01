import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/admin/product.service';

@Component({
    selector: 'app-admin-products',
    templateUrl: './admin-products.component.html',
    styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
    products: any[] = [];
    newProduct = {
        productName: '',
        category: '',
        stock: 0,
        productDescription: '',
        productDiscountedPrice: 0,
        productActualPrice: 0
    };
    selectedProduct: any = null;
    imageUrls: File[] = []; // Array to hold multiple files

    showSuccessToast = false;

    constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.productService.getProducts().subscribe((data) => {
            this.products = data;
            this.cdr.detectChanges();
        });
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

    updateProduct() {
      // Perform the logic to update the product with the new details (e.g., make an API call)
      console.log('Updated Product:', this.selectedProduct);
      // Add logic to update the product in the database, then show a success message
    }

    editProduct(product: any) {
      this.selectedProduct = { ...product }; // Prefill the modal with selected product data
      this.imageUrls = []; // Reset the image files when editing a product
    }

    bootstrap: any;

    hide(): void {
      const addProductModal = new this.bootstrap.Modal(document.getElementById('addProductModal')!);
      addProductModal.hide(); // This will hide the modal
    }
    
}
