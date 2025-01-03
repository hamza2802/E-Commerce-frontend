import { Component, OnInit } from "@angular/core";
import { CartService } from "src/app/services/customer/cart.service";
import { CustomerOrderService } from "src/app/services/customer/customer-order.service";

@Component({
  selector: 'app-cart',
  templateUrl: './customer-cart.component.html',
  styleUrls: ['./customer-cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = []; // Initialized as an empty array

  orderDetails: any; // To store order details after successful order creation
  orderPlaced: boolean = false; // To track if the order was successfully placed

  constructor(private cartService: CartService, private customerOrderService : CustomerOrderService) {}

  ngOnInit(): void {
    this.loadCartItems();
    console.log(this.cartItems);
    
  }

  private loadCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (response: any) => {
        console.log('Cart Items:', response); // Debugging API response
        this.cartItems = response.cartItems || []; // Safe assignment, ensure it's always an array
      },
      error: (err) => console.error('Failed to load cart:', err),
    });
  }

  updateQuantity(cartItemId: number, delta: number) {
    console.log('Cart Item ID in update method:', cartItemId);  // Check if cartItemId is passed correctly
  
    const item = this.cartItems.find((i) => i.cartItemId === cartItemId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        this.removeItem(cartItemId);
      } else {
        this.cartService.updateCartItemQuantity(cartItemId, newQuantity).subscribe({
          next: () => {
            item.quantity = newQuantity;  // Update quantity locally after API success
          },
          error: (err) => console.error('Failed to update quantity:', err),
        });
      }
    }
  }
  
  

  removeItem(cartItemId: number) {
    this.cartService.removeCartItem(cartItemId).subscribe({
      next: () => {
        // Re-fetch the cart items after removal to get the updated cart list
        this.loadCartItems(); // Re-fetch the items
      },
      error: (err) => console.error('Failed to remove item:', err),
    });
  }
  

  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  }

  checkout() {
    this.customerOrderService.createOrder().subscribe({
      next: (response: any) => {
        this.orderDetails = response; // Store the order details after successful creation
        this.orderPlaced = true; // Mark order as placed
        // this.clearCart(); // Clear the cart after placing the order
        console.log('Order placed successfully:', this.orderDetails);
      },
      error: (err) => {
        console.error('Error placing order:', err);
        alert('Failed to place order. Please try again.');
      },
    });
  }

  closeOrderPopup() {
    this.orderPlaced = false; // Close the order popup
  }

  
}
