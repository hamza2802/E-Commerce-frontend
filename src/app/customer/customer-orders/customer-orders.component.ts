import { Component, OnInit } from '@angular/core';
import { CustomerOrderService } from 'src/app/services/customer/customer-order.service';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css'],
})
export class CustomerOrdersComponent implements OnInit {
  orders: any[] = []; // Array to hold order details
  page: number = 0; // Pagination page
  size: number = 10; // Pagination size
  selectedOrder: any = null; // To hold selected order for detailed view

  constructor(private customerOrderService: CustomerOrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.customerOrderService.getOrders(this.page, this.size).subscribe({
      next: (response) => {
        this.orders = response; // Store orders in the array
        console.log('Orders:', this.orders); // Debugging orders
      },
      error: (err) => {
        console.error('Error fetching orders:', err); // Handle error
      },
    });
  }

  viewOrderDetails(order: any): void {
    this.selectedOrder = order; // Set selected order
  }

  closeDetails(): void {
    this.selectedOrder = null; // Close the details view
  }
}
