import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerOrderService } from 'src/app/services/customer/customer-order.service';
import { CartService } from 'src/app/services/customer/cart.service';

declare var paypal: any; // Declare PayPal script

interface PayPalActions {
  order: {
    create: (data: any) => Promise<string>;
    capture: () => Promise<any>;
  };
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  totalPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerOrderService: CustomerOrderService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Retrieve total price from query params
    this.route.queryParams.subscribe(params => {
      this.totalPrice = +params['totalPrice']; // Convert string to number
    });

    // Load PayPal Buttons
    this.loadPaypalButtons();
  }

  loadPaypalButtons() {
    paypal.Buttons({
      createOrder: (data: any, actions: PayPalActions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: this.totalPrice.toFixed(2),
              },
            },
          ],
        });
      },
      onApprove: (data: any, actions: PayPalActions) => {
        return actions.order.capture().then((details: any) => {
          console.log('Transaction completed by ', details.payer.name.given_name);
           const transactionDetails = {
            transactionId: details.id,
            payerName: details.payer.name.given_name + ' ' + details.payer.name.surname,
            payerEmail: details.payer.email_address,
            amount: details.purchase_units[0].amount.value,
            currency: details.purchase_units[0].amount.currency_code,
            status: details.status,
            orderTime: new Date().toISOString(), // or details.update_time if provided
          };

          console.log(transactionDetails);
          
      
          alert('Transaction completed successfully!');

          // Create order and clear the cart
          this.createOrderAndClearCart();
        });
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert('An error occurred during the transaction.');
      },
    }).render('#paypal-button-container');
  }

  private createOrderAndClearCart() {
    // Create order
    this.customerOrderService.createOrder().subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        alert('Order created successfully!');

        // Clear the cart after order creation
        this.cartService.clearCart().subscribe({
          next: () => {
            console.log('Cart cleared successfully.');

            // Navigate to the home page
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Failed to clear cart:', err);
            alert('Failed to clear the cart.');
          }
        });
      },
      error: (err) => {
        console.error('Failed to create order:', err);
        alert('Failed to create order. Please try again.');
      }
    });
  }
}
