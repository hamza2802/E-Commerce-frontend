import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/delivery-agent/orders.service';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
}

export interface Order {
  orderId: number;
  totalAmount: number;
  status: string;
  customerDetails: CustomerDetails;
}

@Component({
  selector: 'app-assigned-orders',
  templateUrl: './delivered-orders.component.html',
  styleUrls: ['./delivered-orders.component.css'],
})
export class DeliveredOrdersComponent implements OnInit {
  // Assign explicit Order[] type to assignedOrders
  assignedOrders: Order[] = [];  
  currentPage: number = 0;
  pageSize: number = 10;

  // Modal variables
  showModal: boolean = false;
  selectedCustomerDetails: CustomerDetails | null = null;  // Use the CustomerDetails type here

  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.loadAssignedOrders();
  }

  loadAssignedOrders(): void {
    this.orderService.getAssignedOrders(this.currentPage, this.pageSize).subscribe(
      (data: Order[]) => {
        // Filter orders with status "Out for delivery"
        this.assignedOrders = data.filter(order => order.status === 'DELIVERED');
      },
      (error) => {
        console.error('Error fetching assigned orders', error);
      }
    );
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAssignedOrders();
    }
  }

  goToNextPage(): void {
    this.currentPage++;
    this.loadAssignedOrders();
  }

  markAsDelivered(orderId: number): void {
    this.orderService.markAsDelivered(orderId).subscribe(
      () => {
        alert('Product delivered successfully!');
        this.loadAssignedOrders(); // Refresh the list
      },
      (error) => {
        console.error('Error marking order as delivered', error);
      }
    );
  }

  viewCustomerDetails(order: Order): void {
    console.log(order.customerDetails);
    
    // Use the Order type here
    this.selectedCustomerDetails = order.customerDetails;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCustomerDetails = null;
  }
}
