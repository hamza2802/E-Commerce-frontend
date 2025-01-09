import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/customer/product.service';

@Component({
  selector: 'app-category-smartwatches',
  templateUrl: './category-smartwatches.component.html',
  styleUrls: ['./category-smartwatches.component.css']
})
export class CategorySmartwatchesComponent implements OnInit {
  smartwatches: any[] = [];
  products: any[] = [];
  filteredHeadphones: any[] = [];
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
        this.maxPrice = Math.max(...this.smartwatches.map((p) => p.productDiscountedPrice));
        this.priceRange.max = this.maxPrice;
        this.filteredHeadphones = [...this.smartwatches];
      },
      (error) => {
        console.error('Error fetching headphones:', error);
      }
    );
  }

  categorizeProducts(products: any[]): void {
    products.forEach((product) => {
      if (product.category === 'Smartwatches') {
        this.smartwatches.push(product);
      }
    });
  }

  extractBrands(): void {
    this.brands = Array.from(
      new Set(this.smartwatches.map((product) => product.productName.split(' ')[0]))
    );
    this.brands.sort();
  }

  applyFilters(): void {
    let filtered = this.smartwatches.filter((product) => {
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

    this.filteredHeadphones = filtered;
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
    this.filteredHeadphones = [...this.smartwatches];
  }

  viewProduct(product: any) {
    this.router.navigate(['customer-dashboard/product-details'], { state: { product } });
  }

  addToCart(product: any) {
    console.log('Adding to cart:', product.productName);
  }
}
