import { Component } from '@angular/core'; 
 
@Component({ 
  selector: 'app-admin-footer', 
  templateUrl: './admin-footer.component.html', 
  styleUrls:  ['./admin-footer.component.css'] 
}) 
export class AdminFooterComponent { 
  currentYear: number = new Date().getFullYear(); 
  supportEmail = 'support@gadgetcart.com'; 
}
