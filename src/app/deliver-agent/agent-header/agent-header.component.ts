import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer/customer.service';  // Ensure that CustomerService is imported
import { Subscription } from 'rxjs';  // Subscription type for unsubscribing later
import { DeliveryAgentService } from 'src/app/services/delivery-agent/deliveryAgentService';

@Component({
  selector: 'app-agent-header',
  templateUrl: './agent-header.component.html',
  styleUrls: ['./agent-header.component.css']
})
export class AgentHeaderComponent implements OnInit, OnDestroy {
  
  username: string = '';  // To display the logged-in user's name
  private userSubscription: Subscription | null = null;  // Subscription to unsubscribe from
  
  constructor(private router: Router, private deliveryAgentService: DeliveryAgentService) { }

  ngOnInit(): void {
    // Subscribe to get the logged-in user's details (name)
    this.userSubscription = this.deliveryAgentService.getDeliveryAgent().subscribe(
      (user) => {
        console.log(user);  // Log the user object for debugging
        this.username = user?.firstname || 'Guest';  // Set the username or default to 'Guest'
      },
      (error) => {
        console.error('Error fetching user details:', error);  // Handle any errors that occur
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from the subscription when the component is destroyed to avoid memory leaks
    this.userSubscription?.unsubscribe();
  }

  logout(): void {
    // Remove token from local storage and navigate to the home page
    localStorage.removeItem('token');
    this.router.navigate(["/customer-dashboard/customer-home"]);
  }
}
