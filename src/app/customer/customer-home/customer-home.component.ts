import { Component, OnInit } from '@angular/core';

// Mock product data (replace with a service call in real applications)
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent implements OnInit {
  products: Product[] = [];
  cartItems: Product[] = [];  // Array to hold cart items

  ngOnInit(): void {
    // Replace with an actual service call to fetch products
    this.products = [
      {
        id: 1,
        name: 'Laptop',
        description: 'High performance laptop with 16GB RAM',
        price: 999.99,
        imageUrl: 'https://via.placeholder.com/150'
      },
      {
        id: 2,
        name: 'Smartphone',
        description: 'Latest model smartphone with amazing features',
        price: 799.99,
        imageUrl: 'https://via.placeholder.com/150'
      },
      {
        id: 3,
        name: 'Headphones',
        description: 'Noise-cancelling wireless headphones',
        price: 199.99,
        imageUrl: 'https://via.placeholder.com/150'
      },
      {
        id: 4,
        name: 'Smartwatch',
        description: 'Track your fitness and stay connected',
        price: 149.99,
        imageUrl: 'https://via.placeholder.com/150'
      }
    ];
  }

  // Method to add items to the cart
  addToCart(product: Product): void {
    this.cartItems.push(product);
    console.log('Product added to cart:', product);
  }

  // Method to calculate total price of the items in the cart
  getTotalPrice(): number {
    return this.cartItems.reduce((total, product) => total + product.price, 0);
  }
}
