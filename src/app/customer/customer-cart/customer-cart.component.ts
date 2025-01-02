import { Component, OnInit } from '@angular/core';

interface CartItem {
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './customer-cart.component.html',
  styleUrls: ['./customer-cart.component.css']
})
export class CustomerCartComponent implements OnInit {
  cartItems: CartItem[] = [
    // Sample items, replace with your dynamic data
    { name: 'Laptop', price: 49999, image: 'assets/laptop.jpg' },
    { name: 'Smartphone', price: 29999, image: 'assets/smartphone.jpg' },
    { name: 'Tablet', price: 19999, image: 'assets/tablet.jpg' }
  ];

  constructor() { }

  ngOnInit(): void { }

  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  checkout(): void {
    // Handle checkout logic
    alert('Proceeding to checkout...');
  }
}
