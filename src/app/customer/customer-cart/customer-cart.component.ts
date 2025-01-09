import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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

  successPopupVisible: boolean = false; // Controls popup visibility
  successPopupMessage: string = ''; // Message for the popup
  popupTimeout: any; // To store the timeout reference


  constructor(private cartService: CartService, private customerOrderService: CustomerOrderService, private router :Router) { }

  ngOnInit(): void {
    this.loadCartItems();
    console.log(this.cartItems);

    //ghjgfjg
    
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

  // Check if the item already exists in the cart
  private isProductInCart(productId: number): boolean {
    const result = this.cartItems.some(item => item.productId === productId);
    console.log(`Is product with ID ${productId} in the cart?`, result);
    return result;
  }
  

  // Add product to cart, or update the quantity if it already exists
  addToCart(product: any) {
    if (this.isProductInCart(product.productId)) {
      this.updateQuantity(product.cartItemId, 1); // Update quantity if product already exists
      this.showSuccessPopup('Product quantity updated successfully!');
    } else {
      this.cartService.addToCart(product).subscribe({
       
        
        
        next: () => {
          console.log("hi");
          this.loadCartItems(); // Re-fetch the cart items after adding
          this.showSuccessPopup('Product added to cart successfully!');
        },
        error: (err) => console.error('Failed to add item:', err),
      });
    }
  }

  // Show success popup with a message
  showSuccessPopup(message: string) {
    this.successPopupMessage = message;
    this.successPopupVisible = true;

    // Hide the popup automatically after 3 seconds
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
    }
    this.popupTimeout = setTimeout(() => {
      this.successPopupVisible = false;
    }, 3000);
  }


  updateQuantity(cartItemId: number, delta: number) {
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

  // checkout() {
  //   this.customerOrderService.createOrder().subscribe({
  //     next: (response: any) => {
  //       this.orderDetails = response; // Store the order details after successful creation
  //       this.orderPlaced = true; // Mark order as placed
  //       console.log('Order placed successfully:', this.orderDetails);
  //     },
  //     error: (err) => {
  //       console.error('Error placing order:', err);
  //       alert('Failed to place order. Please try again.');
  //     },
  //   });
  // }

  checkout() {
    // Pass total price to the checkout page via query parameters or a shared service
    const totalPrice = this.calculateTotalPrice();
    this.router.navigate(['customer-dashboard/customer-checkout'], { queryParams: { totalPrice } });
  }

  closeOrderPopup() {
    this.orderPlaced = false; // Close the order popup
  }
}