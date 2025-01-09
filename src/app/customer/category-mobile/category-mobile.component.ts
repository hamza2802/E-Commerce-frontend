import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/customer/product.service';

@Component({
  selector: 'app-category-mobile',
  templateUrl: './category-mobile.component.html',
  styleUrls: ['./category-mobile.component.css']
})
export class CategoryMobileComponent implements OnInit {
  mobilePhones: any[] = [];
  products: any[] = [];
  filteredMobilephones: any[] = [];
brands: string[] = [];
selectedBrands: string[] = [];
priceRange: { min: number; max: number } = { min: 0, max: 1000 };
maxPrice: number = 1000;
sortOrder: string = ''; // 'low-to-high' or 'high-to-low'
  

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.categorizeProducts(data);
        this.extractBrands();
        this.maxPrice = Math.max(...this.mobilePhones.map((p) => p.productDiscountedPrice));
        this.priceRange.max = this.maxPrice;
        this.filteredMobilephones = [...this.mobilePhones];
      },
      (error) => {
        console.error('Error fetching mobilephones:', error);
      }
    );
  }

  categorizeProducts(products: any[]): void {
    products.forEach((product) => {
      if (product.category === 'Smartphones') {
        this.mobilePhones.push(product);
      }
    });
  }

  extractBrands(): void {
    this.brands = Array.from(
      new Set(this.mobilePhones.map((product) => product.productName.split(' ')[0]))
    );
    this.brands.sort();
  }

  applyFilters(): void {
    let filtered = this.mobilePhones.filter((product) => {
      const matchesBrand =
        this.selectedBrands.length === 0 ||
        this.selectedBrands.includes(product.productName.split(' ')[0]);
      const matchesPrice =
        product.productDiscountedPrice >= this.priceRange.min &&
        product.productDiscountedPrice <= this.priceRange.max;
  
      return matchesBrand && matchesPrice;
    });
  
    // Apply sorting
    if (this.sortOrder === 'low-to-high') {
      filtered.sort((a, b) => a.productDiscountedPrice - b.productDiscountedPrice);
    } else if (this.sortOrder === 'high-to-low') {
      filtered.sort((a, b) => b.productDiscountedPrice - a.productDiscountedPrice);
    }
  
    this.filteredMobilephones = filtered;
  }
  
  toggleBrandSelection(brand: string): void {
    if (this.selectedBrands.includes(brand)) {
      this.selectedBrands = this.selectedBrands.filter((b) => b !== brand);
    } else {
      this.selectedBrands.push(brand);
    }
    this.applyFilters();
  }
  
  changeSortOrder(order: string): void {
    this.sortOrder = order;
    this.applyFilters();
  }
  
  clearFilters(): void {
    this.selectedBrands = [];
    this.priceRange = { min: 0, max: this.maxPrice };
    this.sortOrder = '';
    this.filteredMobilephones = [...this.mobilePhones];
  }
  
  viewProduct(product: any) {
    this.router.navigate(['customer-dashboard/product-details'], { state: { product } });
  }
  
  addToCart(product: any) {
    console.log('Adding to cart:', product.productName);
  }
}

//this is comment


