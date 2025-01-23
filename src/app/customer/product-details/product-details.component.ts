import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/customer/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  mainImage: string = '';

  constructor(private cartService: CartService,private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.product = history.state.product;
    if (!this.product) {
      this.router.navigate(['/home']);
    }
    this.mainImage = this.product.imageUrls[0];
  }

  addToCart(product: any) {
    console.log('Adding to cart', product.productName);
    this.cartService.addToCart(product).subscribe(
      () => {
        console.log('Product added to cart ',`${product.productName}`);
        this.toastr.success(`${product.productName} added to cart successfully!`, 'Success');
        
        
      },
      (error) => {
        console.error('Error adding product to cart:', error);
        this.toastr.error('Failed to add product to cart.', 'Error');
      }
    );
  }

  changeMainImage(image: string) {
    this.mainImage = image;
  }
}
