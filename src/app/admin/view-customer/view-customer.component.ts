import { Component, OnInit } from '@angular/core';
import { CustomerDetails, ViewCustomerservicesService } from 'src/app/services/admin/view-customerservices.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css'],
})
export class ViewCustomerComponent implements OnInit {
  customers: CustomerDetails[] = [];
  filteredCustomers: CustomerDetails[] = [];
  currentPage = 0;
  totalPages = 0;
  selectedCustomer: CustomerDetails | null = null;
  searchTerm: string = '';

  totalCustomers=0;

  constructor(private customerService: ViewCustomerservicesService) {}

  ngOnInit(): void {
    this.loadCustomers(this.currentPage);
  }

  loadCustomers(page: number): void {
    this.customerService.getCustomers(page, 10).subscribe((data) => {
      this.customers = data.content;
      this.filteredCustomers = this.customers; // Initially, show all customers
      this.currentPage = data.number;
      this.totalPages = data.totalPages;
      this.totalCustomers = data.totalElements; // Assuming totalElements is the total count 
      this.customerService.setTotalCustomers(this.totalCustomers);
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadCustomers(page);
    }
  }

  viewDetails(customer: CustomerDetails): void {
    this.selectedCustomer = customer;
  }

  getPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, index) => index);
  }

  searchCustomers(): void {
    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredCustomers = this.customers.filter((customer) =>
      Object.values(customer)
        .join(' ')
        .toLowerCase()
        .includes(searchTermLower)
    );
  }
}
