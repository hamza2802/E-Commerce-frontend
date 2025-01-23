import { Component, OnInit } from '@angular/core';
import { OrderservicesService } from 'src/app/services/admin/orderservices.service';

import { DeliveryAgentService } from 'src/app/services/delivery-agent/deliveryAgentService';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.css'],
})
export class OrdersDashboardComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  paginatedOrders: any[] = [];
  searchQuery: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  currentStatus: string = 'PLACED';
  allOrders: any[] = [];
  selectedOrder: any | null = null;
  isModalVisible: boolean = false;
  deliveryAgents: any[] = [];
  selectedDeliveryAgentId: number | null = null;
  isAgentModalVisibleAssign: boolean = false;
  selectedCustomer: any | null = null;
  isCustomerModalVisible: boolean = false;
  isAgentModalVisible: boolean = false;
  modalType: 'assign' | 'view' | null = null;

  constructor(
    private orderService: OrderservicesService,
    private deliveryAgentService: DeliveryAgentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.filterOrders('PLACED');
  }



  // Apply search and date range filters
  applyFilters(): void {
    if (this.startDate && this.endDate && new Date(this.startDate) > new Date(this.endDate)) {
      alert('Start date cannot be after the end date.');
      return;
    }
  
    this.filteredOrders = this.allOrders.filter((order) => {
      const matchesSearch =
        !this.searchQuery ||
        order.orderId.toString().includes(this.searchQuery) ||
        order.productNames.toLowerCase().includes(this.searchQuery.toLowerCase());
  
      const orderDate = new Date(order.orderDate);
      const matchesDateRange =
        (!this.startDate || orderDate >= new Date(this.startDate)) &&
        (!this.endDate || orderDate <= new Date(this.endDate));
  
      return matchesSearch && matchesDateRange;
    });
  
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.updatePagination();
  }
  

  // Update pagination without making new API calls
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
      this.updatePagination();
    }
  }

  // Change page without making new API calls
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Update number of items per page
  changeItemsPerPage(): void {
    this.currentPage = 1; // Reset to first page
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.updatePagination();
  }

  // View details of a specific order
  viewOrderDetails(order: any): void {
    this.selectedOrder = order;// Set the selected order to display in the modal
    this.isModalVisible = true;  // Show the modal
  }

  // View customer details for a specific order
  viewCustomerDetails(order: any): void {
    // Assuming customer details are in the 'customerDetails' field of each order
    this.selectedCustomer = order.customerDetails;
    this.isCustomerModalVisible = true;  // Show the customer details modal
  }
  
  



  viewDeliveryAgent(order: any): void {
    this.selectedOrder = order;
    
    if (order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED') {
      this.modalType = 'view';
      this.isAgentModalVisible = true;
      this.isAgentModalVisibleAssign = false;
    } else {
      alert('This order is not out for delivery or delivered.');
    }
  }



  
  
  
  

  // Select a delivery agent and assign it to the order
  selectDeliveryAgent(agentId: number): void {
    
    this.selectedDeliveryAgentId = agentId;
    this.assignDeliveryAgentToOrder(agentId);
  }



  // Close order details modal
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedOrder = null;
  }
  
  // closeAgentModal(): void {
  //   this.isAgentModalVisibleAssign = false;
  //   this.selectedOrder = null;
  // }
  
  closeCustomerModal(): void {
    this.isCustomerModalVisible = false;
    this.selectedCustomer = null;
  }

  closeAgentModal(): void {
    this.isAgentModalVisibleAssign = false;
    this.isAgentModalVisible = false;
    this.modalType = null;
    this.selectedOrder = null;
  }
  //sdfgvbhnjedrftghujsdfgvhjsxdfghyjgfcderftg

  filterOrders(status: string): void {
    this.currentStatus = status;
    this.currentPage = 1;
    
    let apiCall: Observable<any[]>;
    
    switch(status) {
      case 'PLACED':
        apiCall = this.orderService.getOrdersByStatus('placed', 0, 1000);
        break;
      case 'OUT_FOR_DELIVERY':
        apiCall = this.orderService.getOrdersByStatus('out_for_delivery', 0, 1000);
        break;
      case 'DELIVERED':
        apiCall = this.orderService.getOrdersByStatus('delivered', 0, 1000);
        break;
      default:
        apiCall = this.orderService.getOrdersByStatus('placed', 0, 1000);
    }

    apiCall.subscribe(
      (data: any[]) => {
        this.allOrders = data.map(order => ({
          ...order,
          productNames: order.orderItems
            ?.map((item: { productName: string }) => item.productName)
            .join(', ') || ''
        }));
        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  // 
  
  loadDeliveryAgents(order: any): void {
    this.selectedOrder = order;
    
    if (order.status === 'PLACED') {
      this.orderService.getDeliveryAgentsByOrderLocation(order.orderId).subscribe(
        (agents) => {
          this.deliveryAgents = agents;
          if (this.deliveryAgents.length === 0) {
            alert(`No delivery agents available for this order.`);
          } else {
            this.modalType = 'assign';
            this.isAgentModalVisibleAssign = true;
            this.isAgentModalVisible = false;
          }
        },
        () => {
          this.deliveryAgents = [];
          this.isAgentModalVisibleAssign = false;
        }
      );
    }
  }
  assignDeliveryAgentToOrder(agent: any): void {
    if (!this.selectedOrder) {
      alert('No order selected.');
      return;
    }
  
    // Call the updated service method
    this.orderService.assignDeliveryAgent(this.selectedOrder.orderId, agent.email) // Use agent email instead of ID
      .subscribe({
        next: (response) => {
          this.toastr.success(`Successfully assigned delivery agent to Order #${this.selectedOrder.orderId}`, 'Success');
          this.closeAgentModal();
          this.filterOrders(this.currentStatus);
        },
        error: (error) => {
          console.error('Error assigning delivery agent:', error);
          alert('Failed to assign delivery agent.');
        }
      });
  }
  
}
