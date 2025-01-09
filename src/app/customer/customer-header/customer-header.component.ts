import { Component, OnInit, OnDestroy, Input } from '@angular/core';  
  import { filter, Subscription } from 'rxjs';  
  import { CartService } from 'src/app/services/customer/cart.service';  
  import { CustomerService } from 'src/app/services/customer/customer.service';  
  import { NavigationEnd, Router } from '@angular/router';  
import { SearchservicesService } from 'src/app/services/customer/searchservices.service';

  
  
  @Component({  
    selector: 'app-customer-header',  
    templateUrl: './customer-header.component.html',  
    styleUrls: ['./customer-header.component.css']  
  })  
  export class CustomerHeaderComponent implements OnInit, OnDestroy {  
    cartItemCount: number = 0;  // To track the number of items in the cart  
      
    userName: string = '';      // To display the logged-in user's name  
    private cartItemCountSubscription: Subscription | null = null;  
    private userSubscription: Subscription | null = null;  
  
    customerDetails: any;   
    searchQuery: string = '';  
  
      
    
  
    constructor(private searchService:SearchservicesService,private cartService: CartService, private customerService: CustomerService,private router: Router,) {}  
  
    goToSection(section: string): void {  
      this.router.navigate(['customer-dashboard/customer-home'], { fragment: section });  
    }  
  
    ngOnInit(): void {  
       
        
      this.router.events.pipe(  
        filter((event) => event instanceof NavigationEnd)  
      ).subscribe(() => {  
        const fragment = this.router.parseUrl(this.router.url).fragment;  
        if (fragment) {  
          const element = document.getElementById(fragment);  
          if (element) {  
            element.scrollIntoView({ behavior: 'smooth' });  
          }  
        }  
      });  
        
      // Subscribe to cart item count updates  
      this.cartItemCountSubscription = this.cartService.getCartItemCount().subscribe(  
        (count) => {  
          this.cartItemCount = count;  
        },  
        (error) => {  
          console.error('Error fetching cart item count:', error);  
        }  
      );  
  
      // Get the logged-in user's name  
      this.userSubscription = this.customerService.getLoggedInUser().subscribe(  
        (user) => {  
          console.log(user);  
            
          this.userName = user?.firstName || 'Guest';  
        },  
        (error) => {
          console.error('Error fetching user details:', error);  
        }  
      );  
    }  
  
    updateCartItemCount(): void {  
      // Refresh the cart item count  
      // this.cartService.refreshCartItemCount();  
    }  
  
    ngOnDestroy(): void {  
      // Unsubscribe from subscriptions to prevent memory leaks  
      this.cartItemCountSubscription?.unsubscribe();  
      this.userSubscription?.unsubscribe();  
    }  
  
    getCustomerDetails(): void {  
      this.customerService.getLoggedInUser().subscribe(  
        (data) => {  
          this.customerDetails = data; // Store the returned customer details  
          console.log('Customer Details:', this.customerDetails); // Log for debugging  
        },  
        (error) => {  
          console.error('Error fetching customer details:', error); // Handle errors  
        }  
      );  
    }  
  
    private fetchCustomerDetailsOnLogin(): void {  
      this.customerService.getLoggedInUser().subscribe(  
        (data) => {  
          this.customerDetails = data; // Store the customer details  
          this.userName = this.customerDetails?.name || 'Guest'; // Extract and store the user's name  
          console.log('Customer Details:', this.customerDetails); // Debugging  
        },  
        (error) => {  
          console.error('Error fetching customer details:', error); // Handle errors  
        }  
      );  
    }  
  
    onSearch(event: any): void {  
      const query = event.target.value.toLowerCase();  
       this.searchService.updateSearchQuery(query);  
      // Navigate to search page when search query is entered  
      if (query.length > 0) {
        this.router.navigate(['/customer-dashboard/search'], {  
          queryParams: { query: query }  
        }); 
         
      }  
    }  
  
    onSearchSubmit(event: Event): void {  
      event.preventDefault();  
      if (this.searchQuery.trim()) {  
        this.router.navigate(['/customer-dashboard/search'], {  
          queryParams: { query: this.searchQuery.trim() }  
        });  
      }  
    }  

    isLoggedIn(): boolean {
      return !!localStorage.getItem('token');
    }
  
    logout(){
      localStorage.removeItem('token');
      this.router.navigate(["/customer-dashboard/customer-home"]);
    }
  
     
  
  }