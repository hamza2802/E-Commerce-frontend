import { Component, OnInit } from '@angular/core';
import { CustomerDetails, ViewCustomerservicesService } from 'src/app/services/admin/view-customerservices.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit {

  customers: CustomerDetails[] = [];
  currentPage = 0;
  totalPages = 0;

  constructor(private customerService: ViewCustomerservicesService) { }


  ngOnInit(): void {
    this.loadCustomers(this.currentPage);
  }

  loadCustomers(page: number): void {
    this.customerService.getCustomers(page, 10).subscribe((data) => {
      this.customers = data.content;
      this.currentPage = data.number;
      this.totalPages = data.totalPages;
    });
  }

  onPageChange(page: number): void {
    this.loadCustomers(page);
  }

  selectedCustomer: CustomerDetails | null = null;

  viewDetails(customer: CustomerDetails): void {
    this.selectedCustomer = customer;
  }

}