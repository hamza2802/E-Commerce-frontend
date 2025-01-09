import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/delivery-agent/orders.service';

export interface CustomerDetails {
  firstName: string;
  lastName : string;
  email: string;
  contactNumber: string;
  address: string;
}

export interface Order {
  orderId: number;
  status: string;
  customerDetails: CustomerDetails;
}

@Component({
  selector: 'app-assigned-orders',
  templateUrl: './assigned-orders.component.html',
  styleUrls: ['./assigned-orders.component.css'],
})
export class AssignedOrdersComponent implements OnInit {
  assignedOrders: Order[] = [];
  currentPage: number = 0;
  pageSize: number = 10;

  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  // Modal variables
  showModal: boolean = false;
  selectedCustomerDetails: CustomerDetails | null = null;

  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.loadAssignedOrders();
  }

  loadAssignedOrders(): void {
    this.orderService.getAssignedOrders(this.currentPage, this.pageSize).subscribe(
      (data: Order[]) => {
        console.log(data);
        
        // Filter orders with status "Out for delivery"
        this.assignedOrders = data.filter(order => order.status === 'OUT_FOR_DELIVERY');
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
        this.showAlert = true;
        this.alertMessage = 'Product delivered successfully!';
        this.alertType = 'success';

        // Hide alert after 3 seconds
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);

        this.loadAssignedOrders(); // Refresh the list
      },
      (error) => {
        this.showAlert = true;
        this.alertMessage = 'Error marking order as delivered';
        this.alertType = 'error';

        // Hide alert after 3 seconds
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);

        console.error('Error marking order as delivered', error);
      }
    );
  }

  viewCustomerDetails(order: Order): void {
    this.selectedCustomerDetails = order.customerDetails;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCustomerDetails = null;
  }
}
