import { Component, OnInit } from '@angular/core';
import { OrderservicesService } from 'src/app/services/admin/orderservices.service';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.css']
})
export class OrdersDashboardComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];

  constructor(private orderService: OrderservicesService) {}

  ngOnInit(): void {
    this.filterOrders('PLACED'); // Default to 'PLACED' orders on initialization
  }

  filterOrders(status: string): void {
    this.orderService.getOrdersByStatus(status).subscribe(
      (data: any[]) => {
        this.filteredOrders = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
        // Implement error handling UI/notification here
      }
    );
  }

  viewOrderDetails(order: any): void {
    console.log('Order Details:', order);
  }
}