import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/customer/product.service';
// Import the service

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent implements OnInit {
  mobilePhones: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // Fetch data from the service when the component initializes
    this.productService.getMobilePhones().subscribe(
      (data) => {
        this.mobilePhones = data;
        console.log(data);
         // Store the fetched data in mobilePhones
      },
      (error) => {
        console.error('Error fetching mobile phones:', error);
      }
    );
  }

  viewAll(product: any) {
    console.log('Viewing details for', product.name);
    // Add navigation logic to view the full product details page
  }

  buyNow(product: any) {
    console.log('Buying', product.name);
    // Add logic to handle buying the product (e.g., adding to cart or redirecting to checkout)
  }
}
