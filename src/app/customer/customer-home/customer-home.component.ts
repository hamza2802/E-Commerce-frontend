import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/customer/product.service';
import { Router } from '@angular/router';
// Import the service

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent implements OnInit {
  mobilePhones: any[] = [];
  viewAllClicked: boolean = false; // Define the viewAllClicked property

  constructor(private productService: ProductService , private router : Router) { }

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

  // Method to toggle the viewAllClicked state
  viewAll() {
    
    this.router.navigate(['customer-dashboard/customer-mobile']); // Toggle the state
    this.viewAllClicked = !this.viewAllClicked;
    console.log('Viewing all products:', this.viewAllClicked);
    
  }

  buyNow(product: any) {
    console.log('Buying', product.name);
    // Add logic to handle buying the product (e.g., adding to cart or redirecting to checkout)
  }

  addToCart(product: any) {
    console.log('Adding to cart', product.productName);
    // Handle the logic to add the product to the cart
  }
}
