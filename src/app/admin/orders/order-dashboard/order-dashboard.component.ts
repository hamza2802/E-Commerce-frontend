import { Component, OnInit } from '@angular/core';
import { OrderservicesService } from 'src/app/services/admin/orderservices.service';


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
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private orderService: OrderservicesService) {}

  ngOnInit(): void {
    this.filterOrders('PLACED'); // Default to 'PLACED' orders
  }

  filterOrders(status: string): void {
    this.orderService.getOrdersByStatus(status).subscribe(
      (data: any[]) => {
        this.orders = data.map(order => ({
          ...order,
          productNames: order.orderItems
            .map((item: { productName: string }) => item.productName)
            .join(', '),
        }));
        this.applyFilters(); // Apply filters after fetching orders
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter((order) => {
      const matchesSearch =
        !this.searchQuery ||
        order.orderId.toString().includes(this.searchQuery) ||
        order.productNames.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesDateRange =
        (!this.startDate || new Date(order.orderDate) >= new Date(this.startDate)) &&
        (!this.endDate || new Date(order.orderDate) <= new Date(this.endDate));

      return matchesSearch && matchesDateRange;
    });

    this.currentPage = 1; // Reset to the first page
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  viewOrderDetails(order: any): void {
    console.log('Order Details:', order);
  }
}
