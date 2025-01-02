import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  mainImage: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.product = history.state.product; // Retrieve the product from the state
    if (!this.product) {
      this.router.navigate(['/']); // Redirect to home if no product data is found
    }
    this.mainImage = this.product.imageUrls[0]; // Set the first image as the main image
  }

  addToCart(product: any) {
    console.log('Adding to cart:', product.productName);
  }

  changeMainImage(image: string) {
    this.mainImage = image; // Update the main image when a thumbnail is clicked
  }
}
