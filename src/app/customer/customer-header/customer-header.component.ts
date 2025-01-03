import { Component } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.css']
})
export class CustomerHeaderComponent {
    // To track the number of items in the cart
  cartItemCount: number = 0;  // To track the number of items in the cart
  private cartItemCountSubscription: Subscription | null = null;



  ngOnInit(): void {
    this.updateCartItemCount();  // Update cart item count when the component is initialized
    
    
  }
  

  // Method to update cart count
  updateCartItemCount() {
     // Get the count from CartService
  }

}
