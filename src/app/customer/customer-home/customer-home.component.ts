import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/customer/product.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/customer/cart.service'; // Import CartService
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent implements OnInit {
  mobilePhones: any[] = [];
  products: any[] = [];
  viewAllClicked: boolean = false; // Define the viewAllClicked property
  headphones : any[] = [];
  smartwatches: any[] = [];

  

  constructor(
    private productService: ProductService, 
    private router: Router,
    private toastr: ToastrService,
    private cartService: CartService  // Inject CartService
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.products = data;

        // Categorizing products
        this.mobilePhones = data.filter(product => product.category === 'Smartphones');
        this.headphones = data.filter(product => product.category === 'Headphones');
        this.smartwatches = data.filter(product => product.category === 'Smartwatches');

        console.log('All Products:', this.products);
        console.log('Smartphones:', this.mobilePhones);
        console.log('Headphones:', this.headphones);
        console.log('Smartwatches:', this.smartwatches);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Method to toggle the viewAllClicked state
  viewMobilePage() { 
    this.router.navigate(['customer-dashboard/customer-mobile']); // Toggle the state
    this.viewAllClicked = !this.viewAllClicked;
    console.log('Viewing all products:', this.viewAllClicked);
  }

  viewHeadphonePage() { 
    this.router.navigate(['customer-dashboard/customer-headphones']); // Toggle the state
    this.viewAllClicked = !this.viewAllClicked;
    console.log('Viewing all products:', this.viewAllClicked);
  }

  viewWatchesPage() { 
    this.router.navigate(['customer-dashboard/customer-smartwatches']); // Toggle the state
    this.viewAllClicked = !this.viewAllClicked;
    console.log('Viewing all products:', this.viewAllClicked);
  }

  buyNow(product: any) {
    console.log('Buying', product.name);
    this.cartService.addToCart(product).subscribe(
      () => {
        console.log('Product added to cart');
        this.router.navigate(['customer-dashboard/customer-cart']);  // Redirect to cart page
      },
      (error) => {
        console.error('Error adding product to cart:', error);
      }
    );
  }

  navigateToProduct(productId: string): void {
    this.router.navigate(['/customer-dashboard/product-details'], { queryParams: { id: productId } });
  }
  

  addToCart(product: any) {
    console.log('Adding to cart', product.productName);
    this.cartService.addToCart(product).subscribe(
      () => {
        console.log('Product added to cart ',`${product.productName}`);
        this.toastr.success(`${product.productName} added to cart successfully!`, 'Success');
        
        
      },
      (error) => {
        console.error('Error adding product to cart:', error);
        this.toastr.error('Failed to add product to cart.', 'Error');
      }
    );
  }
}
