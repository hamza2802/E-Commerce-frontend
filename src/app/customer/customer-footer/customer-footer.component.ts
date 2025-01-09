import { Component } from '@angular/core'; 
 
@Component({ 
  selector: 'app-customer-footer', 
  templateUrl: './customer-footer.component.html', 
  styleUrls: ['./customer-footer.component.css'] 
}) 
export class CustomerFooterComponent { 
 
   
  currentYear: number = new Date().getFullYear();  
  supportEmail = 'support@gadgetcart.com';  
 
}