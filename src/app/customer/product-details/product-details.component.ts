import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/customer/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  mainImage: string = '';

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.product = history.state.product;
    if (!this.product) {
      this.router.navigate(['/home']);
    }
    this.mainImage = this.product.imageUrls[0];
  }

  addToCart(product: any) {
    this.cartService.addToCart(product).subscribe({
      next: () => alert(`${product.productName} added/updated in the cart successfully!`),
      error: (err) => console.error('Failed to add/update cart:', err),
    });
  }

  changeMainImage(image: string) {
    this.mainImage = image;
  }
}
