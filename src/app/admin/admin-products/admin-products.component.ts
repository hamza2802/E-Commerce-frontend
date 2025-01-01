import { Component, OnInit } from '@angular/core';
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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
      this.loadProducts();
  }

  loadProducts(): void {
      this.productService.getProducts().subscribe((data) => {
          this.products = data;
      });
  }

  addProduct(): void {
      const formData = new FormData();
      
      // Serialize product data into JSON string
      const productJson = JSON.stringify(this.newProduct);
      formData.append('product', productJson);  // Send as a single 'product' parameter

      // Append multiple image files
      this.imageUrls.forEach((image) => {
          formData.append('files', image, image.name); // Append each file with a name
      });

      console.log(formData);

      this.productService.addProduct(formData).subscribe(() => {
          this.loadProducts();
          this.resetForm();
      });
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
      this.imageUrls = [];  // Reset the image array
  }

  onFileSelected(event: any): void {
      this.imageUrls = event.target.files; // Store selected files as an array
  }

  viewProduct(product: any): void {
      this.selectedProduct = product;
  }
}
