import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'; 
import { OrderservicesService } from 'src/app/services/admin/orderservices.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { ViewCustomerservicesService } from 'src/app/services/admin/view-customerservices.service'; 
import { DeliveryAgentService } from 'src/app/services/delivery-agent/deliveryAgentService';

 
@Component({ 
  selector: 'app-admin-home', 
  templateUrl: './admin-home.component.html', 
  styleUrls: ['./admin-home.component.css'] 
}) 
export class AdminHomeComponent implements OnInit { 
 
  @ViewChild('fileInput') fileInput!: ElementRef;
  totalCustomers: number = 0;  // Store total customers count here
  totalProducts: number = 0; // Store total products count here 
  totalOrders: number = 0; // Store total orders count here
  totalDeliveryAgents: number = 0; // Store total delivery agents count here  // Assume DeliveryAgentService has a getDeliveryAgents method for fetching delivery agents count.
 
  constructor(private customerService: ViewCustomerservicesService, 
    private productService:ProductService,
    private ordersService: OrderservicesService,
  private  deliveryAgentService:DeliveryAgentService) { } 
 
  ngOnInit(): void { 
    // Fetch the total customer count immediately when the component loads 
    this.fetchTotalCustomerCount(); 
    this.fetchTotalProductCount(); 
    this.fetchTotalOrderCount();  // Fetch the total order count immediately when the component loads
    this.fetchTotalDeliveryAgentCount();
  } 
 
  fetchTotalCustomerCount(): void { 
    // Fetch the first page of customers (or any arbitrary page, since we just need the count) 
    this.customerService.getCustomers(0, 10).subscribe((data) => { 
      // Set the total customer count based on the response 
      this.totalCustomers = data.totalElements;  // Assuming totalElements holds the total count 
      this.customerService.setTotalCustomers(this.totalCustomers); // Update total customer count in service 
    }); 
  } 
  fetchTotalProductCount(): void {
    this.productService.getProducts().subscribe((data) => {
      this.totalProducts = data.length; // Assuming data is an array of products
    });
  }


  fetchTotalOrderCount(): void { 
    // Fetch the first page of orders with a small page size 
    this.ordersService.getAllOrders().subscribe((data) => { 
      this.totalOrders = data.length; // Assuming totalElements holds the total order count 
    }); 
  }
  fetchTotalDeliveryAgentCount(): void {
    this.deliveryAgentService.getDeliveryAgents(0, 1).subscribe((data) => {
      this.totalDeliveryAgents = data.totalElements; // Assuming totalElements holds the total count
    });
  }

  handleFileUpload(event: Event): void { 
    const input = event.target as HTMLInputElement; 
    if (input.files && input.files.length > 0) { 
      const file = input.files[0]; 
      const formData = new FormData(); 
      formData.append('file', file); 
 
      // Call the service method to upload the file 
      this.productService.uploadProductsCSV(formData).subscribe({ 
        next: (response) => { 
          console.log('File uploaded successfully', response); 
          alert('Products added successfully!'); 
        }, 
        error: (err) => { 
          console.error('Error uploading file', err); 
          alert('Failed to upload file.'); 
        } 
      }); 
    } 
  }

  triggerFileInput(): void { 
    this.fileInput.nativeElement.click(); 
  }


}