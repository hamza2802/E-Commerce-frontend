import { Component, OnInit } from '@angular/core'; 
import { ViewCustomerservicesService } from 'src/app/services/admin/view-customerservices.service'; 
 
@Component({ 
  selector: 'app-admin-home', 
  templateUrl: './admin-home.component.html', 
  styleUrls: ['./admin-home.component.css'] 
}) 
export class AdminHomeComponent implements OnInit { 
 
  totalCustomers: number = 0;  // Store total customers count here 
 
  constructor(private customerService: ViewCustomerservicesService) { } 
 
  ngOnInit(): void { 
    // Fetch the total customer count immediately when the component loads 
    this.fetchTotalCustomerCount(); 
  } 
 
  fetchTotalCustomerCount(): void { 
    // Fetch the first page of customers (or any arbitrary page, since we just need the count) 
    this.customerService.getCustomers(0, 10).subscribe((data) => { 
      // Set the total customer count based on the response 
      this.totalCustomers = data.totalElements;  // Assuming totalElements holds the total count 
      this.customerService.setTotalCustomers(this.totalCustomers); // Update total customer count in service 
    }); 
  } 
}