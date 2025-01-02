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

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getMobilePhones().subscribe(
      (data) => {
        this.mobilePhones = data;
      },
      (error) => {
        console.error('Error fetching mobile phones:', error);
      }
    );
  }

  viewProduct(product: any) {
    this.router.navigate(['customer-dashboard/product-details'], { state: { product } });
  }

  addToCart(product: any) {
    console.log('Adding to cart:', product.productName);
  }
}
